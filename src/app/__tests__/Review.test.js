import React from "react";
import { shallow } from "enzyme";
import Review from "../review/Review";

it("renders without crashing", () => {
  const wrapper = shallow(<Review />);
  expect(wrapper).toHaveLength(1);
});
