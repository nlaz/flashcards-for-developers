import React from "react";
import { shallow } from "enzyme";
import Collections from "../collections/Collections";

it("renders without crashing", () => {
  const wrapper = shallow(<Collections />);
  expect(wrapper).toHaveLength(1);
});
