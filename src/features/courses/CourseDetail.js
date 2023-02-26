import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  Col,
  CardImgOverlay,
} from "reactstrap";
// import SubHeader from "../../components/SubHeader";

const CourseDetail = ( { course } ) => {
        const { image, icon, name, description, theme } = course;
  
    return (
      <Col md="11" className="m-4">
        {theme}
        {/* <SubHeader 
        current={course.icon} 
        detail={true} /> */}
        <Card>
          <CardTitle className="card-detail-title">
            {icon} {name}
          </CardTitle>
          <CardImg top src={image} alt={name} />
          <CardBody>
            {/* <CardImgOverlay id="icon"><span>{name}</span>{icon}</CardImgOverlay> */}
            <CardText>{description}</CardText>
          </CardBody>
        </Card>
      </Col>
    );
};

export default CourseDetail;