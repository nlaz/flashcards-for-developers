import React from "react";
import { shallow } from "enzyme";
import Home from "../home/Home";

jest.mock("../apiActions", () => ({
  searchCollections: () => Promise.resolve({ data: [] }),
  fetchCollections: () => Promise.resolve({ data: [] }),
  fetchStudyProgress: () => Promise.resolve({ data: [] }),
  fetchPinnedDecks: () => Promise.resolve({ data: [] }),
}));

it("renders without crashing", () => {
  const context = { mixpanel: { track: () => {} } };
  const wrapper = shallow(<Home />, { context });
  expect(wrapper).toHaveLength(1);
});
