import { Card, CardImg, CardImgOverlay, CardTitle } from "reactstrap";

const CourseCard = ({ course }) => {
  const { image, name } = course;
        return (
          <Card>
            <CardImg className='card-image'
              src={image}
              alt={name}
            />{" "}
            <CardImgOverlay>
              <CardTitle>{name}</CardTitle>
            </CardImgOverlay>
          </Card>
        );
}

export default CourseCard;