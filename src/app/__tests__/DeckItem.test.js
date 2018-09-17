import React from "react";
import { shallow } from "enzyme";
import DeckItem from "../home/DeckItem";

it("renders without crashing", () => {
  const wrapper = shallow(<DeckItem />);
  expect(wrapper).toHaveLength(1);
});
