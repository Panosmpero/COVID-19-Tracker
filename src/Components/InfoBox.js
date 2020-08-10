import React from "react";
import formatNumber from "../formatNumber";
import numeral from "numeral";
import { Card, CardContent, Typography } from "@material-ui/core";

const InfoBox = ({ title, cases, total, onClick, isActive, isCase, isDeath }) => {

  return (
    <Card 
      className={`infoBox ${isActive && "infoBox__active"} ${isCase && "infoBox__case" } ${isDeath && "infoBox__death"}`}
      onClick={onClick}
      >
      <CardContent className="infoBox-wrapper">
        <Typography className="infoBox__title" color="textSecondary">
          {title}
        </Typography>

        <h2 className="infoBox__cases">{formatNumber(cases)}</h2>

        <Typography className="infoBox__total" color="textPrimary">
          {total !== 0 ? numeral(total).format("0.0a") : "0 / Unvailable"} Total
        </Typography>
      </CardContent>
    </Card>
  );
};

export default InfoBox;
