import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/user/userSlice';
import {
  Button,
  FormGroup,
  Label,
  Input,
  Alert,
  Spinner,
  Card,
  CardBody,
  ListGroup,
  ListGroupItem,
  Badge,
} from 'reactstrap';
import {
  setupDriveFolder,
  searchDrive,
  hasDriveAccess,
  getDriveAccessToken,
  formatDriveFiles,
} from '../utils/googleDriveAPI';

const GoogleDriveSearch = ({ lessonTopic, onFilesSelected }) => {
  const currentUser = useSelector(selectCurrentUser);
  const [driveFolder, setDriveFolder] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [setupComplete, setSetupComplete] = useState(false);
  const [searching, setSearching] = useState(false);

  const hasAccess = hasDriveAccess(currentUser);
  const accessToken = getDriveAccessToken(currentUser);

  // Setup folder on component mount if user has Drive access
  useEffect(() => {
    if (hasAccess && !setupComplete && accessToken) {
      handleSetupFolder();
    }
  }, [hasAccess, setupComplete, accessToken]);

  // Auto-search when lesson topic changes
  useEffect(() => {
    if (hasAccess && setupComplete && lessonTopic && lessonTopic.length > 3) {
      handleSearch();
    }
  }, [lessonTopic, hasAccess, setupComplete]);

  const handleSetupFolder = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await setupDriveFolder(accessToken);
      setDriveFolder(result);
      setSetupComplete(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!lessonTopic || lessonTopic.length < 3) {
      setError('Please enter a lesson topic to search');
      return;
    }

    setSearching(true);
    setError(null);

    try {
      const result = await searchDrive(accessToken, lessonTopic, {
        folderId: driveFolder?.folderId,
        maxResults: 15,
      });

      const formattedFiles = formatDriveFiles(result.files);
      setSearchResults(formattedFiles);

      // Auto-select all results by default
      setSelectedFiles(formattedFiles.map(f => f.id));
      onFilesSelected(formattedFiles);
    } catch (err) {
      setError(err.message);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleFileToggle = (fileId) => {
    setSelectedFiles(prev => {
      const newSelection = prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId];

      // Update parent component with selected files
      const selectedFileObjects = searchResults.filter(f =>
        newSelection.includes(f.id)
      );
      onFilesSelected(selectedFileObjects);

      return newSelection;
    });
  };

  if (!hasAccess) {
    return (
      <Card className="mb-3 border-info">
        <CardBody>
          <h6 className="text-info">
            <i className="fa fa-google" /> Search Your Google Drive
          </h6>
          <p className="text-muted small mb-2">
            Sign in with Google to include your own teaching materials in lesson plans
          </p>
          <Alert color="info" className="mb-0 small">
            Use the "Sign in with Google" button at the top to enable Drive search.
            You'll be able to create a dedicated folder for your teaching materials.
          </Alert>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="mb-3 border-success">
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="text-success mb-0">
            <i className="fa fa-google" /> Your Google Drive Materials
          </h6>
          {setupComplete && driveFolder && (
            <a
              href={driveFolder.folderLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-outline-success"
            >
              <i className="fa fa-folder-open" /> Open Folder
            </a>
          )}
        </div>

        {error && (
          <Alert color="danger" className="small">
            {error}
          </Alert>
        )}

        {loading && (
          <div className="text-center py-3">
            <Spinner color="success" size="sm" /> Setting up your folder...
          </div>
        )}

        {setupComplete && driveFolder && (
          <>
            <Alert color="success" className="small mb-3">
              <strong>Ready!</strong> Drop teaching materials into your{' '}
              <strong>{driveFolder.folderName}</strong> folder.
              {driveFolder.existed
                ? ' Using existing folder.'
                : ' Folder created in your Drive.'}
            </Alert>

            <FormGroup>
              <div className="d-flex justify-content-between align-items-center">
                <Label className="mb-0">
                  Search Results {searchResults.length > 0 && `(${searchResults.length})`}
                </Label>
                <Button
                  color="success"
                  size="sm"
                  onClick={handleSearch}
                  disabled={searching || !lessonTopic || lessonTopic.length < 3}
                >
                  {searching ? (
                    <>
                      <Spinner size="sm" /> Searching...
                    </>
                  ) : (
                    <>
                      <i className="fa fa-search" /> Search Drive
                    </>
                  )}
                </Button>
              </div>
              <small className="text-muted">
                Files matching "{lessonTopic || 'your topic'}" in your TeachLeague folder
              </small>
            </FormGroup>

            {searchResults.length > 0 && (
              <ListGroup className="mt-2">
                {searchResults.map(file => (
                  <ListGroupItem
                    key={file.id}
                    className="d-flex justify-content-between align-items-start py-2"
                  >
                    <div className="d-flex align-items-start flex-grow-1">
                      <Input
                        type="checkbox"
                        checked={selectedFiles.includes(file.id)}
                        onChange={() => handleFileToggle(file.id)}
                        className="mt-1 me-2"
                      />
                      <div className="flex-grow-1">
                        <a
                          href={file.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-decoration-none"
                        >
                          <strong>{file.displayName}</strong>
                        </a>
                        <div className="small text-muted">
                          <Badge color="secondary" className="me-2">
                            {file.fileType}
                          </Badge>
                          Modified: {file.modifiedDate} · {file.owner}
                        </div>
                      </div>
                    </div>
                  </ListGroupItem>
                ))}
              </ListGroup>
            )}

            {!searching && searchResults.length === 0 && lessonTopic && lessonTopic.length > 3 && (
              <Alert color="info" className="small mt-2">
                No materials found for "{lessonTopic}". Try adding files to your folder or
                broadening your search.
              </Alert>
            )}
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default GoogleDriveSearch;
