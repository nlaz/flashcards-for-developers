import React from "react";
import { shallow } from "enzyme";
import CollectionItem from "../collections/CollectionItem";

it("renders without crashing", () => {
  const wrapper = shallow(<CollectionItem />);
  expect(wrapper).toHaveLength(1);
});
