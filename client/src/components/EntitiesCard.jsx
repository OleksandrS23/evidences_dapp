import React from "react";
import {
  Card as MiuCard,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActionArea,
  CardActions,
  ButtonBase,
} from "@mui/material";
import { Card, Row, Col, ListGroup } from "react-bootstrap";

function EntitiesCard(props) {
  return (
    <Row>
      {props.EntitiesData.map((entities, index) => (
        <Col md="auto" className="mb-2" key={entities.entityAddress}>
          <MiuCard>
            <CardActionArea onClick={event => { console.log(entities.entityAddress) }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div"> {entities.name} </Typography>
                <Typography variant="body2" color="text.secondary"> {entities.departmentCode} </Typography>
                <Typography variant="body2" color="text.secondary"> {entities.entityType} </Typography>
                <Typography variant="body2" color="text.secondary"> {entities.entityAddress} </Typography>
              </CardContent>
            </CardActionArea>
            {/* <CardActions>
              <Button size="small" color="primary">
                Share
              </Button>
            </CardActions> */}
          </MiuCard>
        </Col>
      ))}
    </Row>
  );
}

export default EntitiesCard;
