import React from "react";
import { shallow } from "enzyme";
import CollectionsHome from "../collections/CollectionsHome";

jest.mock("../apiActions", () => ({
  fetchCollections: () => Promise.resolve({ data: [] }),
}));

it("renders without crashing", () => {
  const wrapper = shallow(<CollectionsHome />);
  expect(wrapper).toHaveLength(1);
});
