import React from "react";
import { Table, Dropdown } from "semantic-ui-react";

const ResultGrid = (props) => {
  const { selectedParameter, locationData } = props;
  return (
    <>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Last Updated</Table.HeaderCell>
            <Table.HeaderCell>City Name</Table.HeaderCell>
            <Table.HeaderCell>Location Name</Table.HeaderCell>
            <Table.HeaderCell>{selectedParameter}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {locationData.map((location, id) => {
            let date = location.lastUpdated;
            let formatted_date = date.substring(0, date.indexOf("T"));
            return (
              <Table.Row key={id}>
                <Table.Cell>{formatted_date}</Table.Cell>
                <Table.Cell>{location.city}</Table.Cell>
                <Table.Cell>{location.name}</Table.Cell>
                <Table.Cell>{location.parameters.filter(param => param.parameter == selectedParameter).map(item => {
                  return `${item.lastValue}${item.unit}`;
                })}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
      <style>
        {`
          .my-css-class {

          }
        `}
      </style>
    </>
  );
};

export default ResultGrid;
