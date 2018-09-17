import React from "react";
import { shallow } from "enzyme";
import Home from "../home/Home";

jest.mock("../apiActions", () => ({
  fetchCollections: () => Promise.resolve({ data: [] }),
  fetchStudyProgress: () => Promise.resolve({ data: [] }),
  fetchSavedDecks: () => Promise.resolve({ data: [] }),
}));

it("renders without crashing", () => {
  const wrapper = shallow(<Home />);
  expect(wrapper).toHaveLength(1);
});
