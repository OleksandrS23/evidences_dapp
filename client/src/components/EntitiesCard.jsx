import React, { useEffect, useState } from "react";
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
  const { drizzleContext, EntitiesData } = props;

  return (
    <Row>
      {props.EntitiesData.map((entities, index) => {
        let condition = false;
        if (
          entities.entityAddress == drizzleContext.drizzleState.accounts[0]
        ) {
          console.log(true);
          condition = true;
        } else {
          console.log(false);
          condition = false;
        }
        return (
          <Col md="auto" className="mb-2" key={entities.entityAddress}>
            <MiuCard
              sx={{
                boxShadow: condition
                  ? "2px 2px 2px 2px rgba(0, 255, 0, 0.4)" // Stronger shadow when the condition is true
                  : "2px 2px 2px 2px rgba(0, 0, 0, 0.2)", // Green shadow when the condition is false
                transition: "0.3s", // Smooth transition
                // "&:hover": {
                //   boxShadow: "0px 8px 16px 0px rgba(0, 255, 0, 0.4)", // Stronger shadow on hover
                // },
              }}
            >
              <CardActionArea
                onClick={(event) => {
                  console.log(entities.entityAddress);
                }}
              >
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {" "}
                    {entities.name}{" "}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {" "}
                    {entities.departmentCode}{" "}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {" "}
                    {entities.entityType}{" "}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {" "}
                    {entities.entityAddress}{" "}
                  </Typography>
                </CardContent>
              </CardActionArea>
              {/* <CardActions>
              <Button size="small" color="primary">
                Share
              </Button>
            </CardActions> */}
            </MiuCard>
          </Col>
        );
      })}
    </Row>
  );
}

export default EntitiesCard;
