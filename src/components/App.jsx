import React from "react";
import { Container, Dropdown, Button, Form, Header } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

import ResultGrid from "./ResultGrid.jsx";
import { apiRequest } from "../helpers.js";

export default class App extends React.Component {
  _isMounted = false;

  state = {
    citiesData: [],
    citiesLoaded: false,
    cityNamesList: [],
    disableCompare: true,
    isCompared: false,
    locationData: [],
    parameterList: [],
    selectedParameter: "",
  };

  componentDidMount() {
    this._isMounted = true;

    // GET Cities List
    apiRequest(
      "https://u50g7n0cbj.execute-api.us-east-1.amazonaws.com/v2/cities?limit=810&sort=asc&country_id=US",
      "GET",
      {}
    )
      .then((response) => {
        let citiesData = response.results.filter((city) => isNaN(city.city));
        let cityNamesList = citiesData.map((city, id) => {
          let cityObj = { key: id, text: city.city, value: city.city };
          return cityObj;
        });

        if (this._isMounted) {
          this.setState({ citiesData, citiesLoaded: true, cityNamesList });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { disableCompare, selectedCity_1, selectedCity_2 } = this.state;

    // Keeping user from selecting and comparing the same city
    if (
      disableCompare &&
      selectedCity_1 &&
      selectedCity_2 &&
      selectedCity_1 != selectedCity_2
    ) {
      this.setState({ disableCompare: false });
    }

    if (
      !disableCompare &&
      selectedCity_1 &&
      selectedCity_2 &&
      selectedCity_1 == selectedCity_2
    ) {
      this.setState({ disableCompare: true, selectedParameter: "" });
    }

    // Check for city change
    if (
      (selectedCity_1 &&
        selectedCity_2 ) &&
        prevState.selectedCity_1 != selectedCity_1 ||
      prevState.selectedCity_2 != selectedCity_2
    ) {
      this.setState({ isCompared: false });
    }
  }

  compareCities = () => {
    const { selectedCity_1, selectedCity_2 } = this.state;
    apiRequest(
      `https://u50g7n0cbj.execute-api.us-east-1.amazonaws.com/v2/locations?limit=100&&sort=asc&country_id=US&city=${selectedCity_1}&city=${selectedCity_2}&order_by=lastUpdated`,
      "GET",
      {}
    ).then((response) => {
      let locationData = response.results;
      this.setState({ locationData });
    });
    this.setState({ isCompared: true });
    this.getAvailableParameters();
  };

  getAvailableParameters = () => {
    const { citiesData, selectedCity_1, selectedCity_2 } = this.state;
    let params = [];

    citiesData
      .filter((city) => city.city == selectedCity_1)
      .map((item) => {
        params = [...params, ...item.parameters];
      });

    citiesData
      .filter((city) => city.city == selectedCity_2)
      .map((item) => {
        params = [...params, ...item.parameters];
      });

    params = [...new Set(params)];

    let parameterList = params.map((param, id) => {
      return { key: id, text: param, value: param };
    });

    this.setState({ parameterList, selectedParameter: params[0] });
  };

  handleDropdownChange = (e, data) => {
    const { id, value } = data;
    this.setState({ [id]: value });
  };

  resetSelections = () => {
    this.setState({
      selectedCity_1: "",
      selectedCity_2: "",
      disableCompare: true,
      isCompared: false,
    });
  };

  render() {
    const {
      citiesLoaded,
      cityNamesList,
      disableCompare,
      isCompared,
      locationData,
      parameterList,
      selectedParameter,
      selectedCity_1,
      selectedCity_2,
    } = this.state;
    return (
      <Container text>
        <div className="header-container">
          <Header
            as="h1"
            content="Air Quality"
            style={{
              fontSize: "4em",
              fontWeight: "bold",
              marginTop: "1em",
              marginBottom: "0",
              textAlign: "center",
            }}
          />
          <Header
            as="h2"
            content="Assessment Tool"
            style={{
              fontSize: "1.7em",
              fontWeight: "bold",
              marginTop: "0",
              marginBottom: "2em",
              textAlign: "center",
            }}
          />
        </div>
        <span className="instructions">Instructions</span>
        <ul>
          <li>Select a city from the city dropdowns</li>
          <li>Click "Compare"</li>
          <li>Change "Available Parameter to Compare" as desired</li>
          <li>
            when you change a city, you must compare before you can change the
            parameter
          </li>
        </ul>
        <ResultGrid
          selectedParameter={selectedParameter}
          locationData={locationData}
        />
        <Form>
          <Form.Group widths="equal">
            <Form.Field>
              <label>City 1</label>
              <Dropdown
                id="selectedCity_1"
                onChange={this.handleDropdownChange}
                options={cityNamesList}
                placeholder="Choose an option"
                selection
                value={selectedCity_1}
                disabled={!citiesLoaded}
              />
            </Form.Field>
            <Form.Field>
              <label>City 2</label>
              <Dropdown
                id="selectedCity_2"
                onChange={this.handleDropdownChange}
                options={cityNamesList}
                placeholder="Choose an option"
                selection
                value={selectedCity_2}
                disabled={!citiesLoaded}
              />
            </Form.Field>
          </Form.Group>
          <Form.Field>
            <label>Available Parameter to Compare</label>
            <Dropdown
              id="selectedParameter"
              onChange={this.handleDropdownChange}
              options={parameterList}
              placeholder="Choose an option"
              selection
              value={selectedParameter}
              disabled={!isCompared}
            />
          </Form.Field>
          <label> </label>
          <Button disabled={disableCompare} onClick={this.compareCities}>
            Compare
          </Button>
          <label> </label>
          <Button
            disabled={!!selectedCity_1 || !!selectedCity_2 ? false : true}
            onClick={this.resetSelections}
          >
            Reset
          </Button>
        </Form>
        <style>
          {`
            .header-container {
              margin-bottom: 10px;
              display: grid;
              background-image: url("https://www.publicdomainpictures.net/pictures/180000/velka/sun-clouds-blue-sky-146410201994j.jpg");
            }

            .instructions {
              padding: 10px 0px;
              text-align: justify;
              font-size: 1.2em
            }
            `}
        </style>
      </Container>
    );
  }
}
