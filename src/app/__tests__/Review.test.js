import React from "react";
import { shallow } from "enzyme";
import Review from "../review/Review";

it("renders without crashing", () => {
  const context = { mixpanel: { track: () => {} } };
  const wrapper = shallow(<Review />, { context });
  expect(wrapper).toHaveLength(1);
});
