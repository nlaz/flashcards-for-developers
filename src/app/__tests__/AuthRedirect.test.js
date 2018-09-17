import React from "react";
import { shallow } from "enzyme";
import AuthRedirect from "../auth/AuthRedirect";

it("renders without crashing", () => {
  const wrapper = shallow(<AuthRedirect />);
  expect(wrapper).toHaveLength(1);
});
