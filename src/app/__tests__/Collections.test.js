import React from "react";
import { shallow } from "enzyme";
import Collections from "../collections/Collections";

jest.mock("../apiActions", () => ({
  fetchCollections: () => Promise.resolve({ data: [] }),
  fetchStudyProgress: () => Promise.resolve({ data: [] }),
  fetchSavedDecks: () => Promise.resolve({ data: [] }),
}));

it("renders without crashing", () => {
  const wrapper = shallow(<Collections />);
  expect(wrapper).toHaveLength(1);
});
