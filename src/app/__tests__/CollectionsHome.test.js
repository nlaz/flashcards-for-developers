import React from "react";
import { shallow } from "enzyme";
import CollectionsHome from "../collections/CollectionsHome";

jest.mock("../apiActions", () => ({
  fetchCollections: () => Promise.resolve({ data: [] }),
}));

it("renders without crashing", () => {
  const context = { mixpanel: { track: () => {} } };
  const wrapper = shallow(<CollectionsHome />, { context });
  expect(wrapper).toHaveLength(1);
});
