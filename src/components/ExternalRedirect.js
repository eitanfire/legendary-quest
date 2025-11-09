import { useEffect } from 'react';

const ExternalRedirect = ({ to }) => {
  useEffect(() => {
    window.location.href = to;
  }, [to]);

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
      <div className="text-center">
        <h3>Redirecting to {to}...</h3>
        <p className="text-muted">If you are not redirected, <a href={to}>click here</a>.</p>
      </div>
    </div>
  );
};

export default ExternalRedirect;
