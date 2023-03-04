import CoursesList from "../../src/features/courses/CoursesList";

const coursesPerRow = 4;
export const loadMoreCourses = ({ loadMoreCourses }) => {
  const [next, setNext] = useState(coursePerRow);
  const handleMoreCourse = () => {
    setNext(next + coursePerRow);
  };
  return (
    <>
      <div className="gap-y-4 flex flex-wrap justify-center">
        {loadMoreCourses?.slice(0, next)?.map((course, index) => {
          return (
            <div key={index} className="px-2.5 md:px-0">
              <img className="cursor-pointer" src={course?.url} />
            </div>
          );
        })}
        {next < coursePerRow?.length && (
          <Button className="mt-4" onClick={handleMoreImage}>
            Load more
          </Button>
        )}
      </div>
    </>
  );
};
