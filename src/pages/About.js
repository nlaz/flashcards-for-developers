import React from "react";

const Avatar = ({ src, alt }) => (
  <img
    className="rounded rounded-circle"
    style={{ width: "75px", height: "75px" }}
    src={src}
    alt={alt}
  />
);

const About = () => (
  <div>
    <div className="container container--narrow py-5">
      <div className="mb-5 py-4">
        <h5 className="font-weight-bold text-uppercase">Flashcards for Developers</h5>
        <p className="text-dark font-weight-medium">
          Flashcards for Developers is a learning tool for developers by developers. It is a place
          for those who want to learn better, grow their expertise, and keep those skills sharp.
        </p>
        <a href="mailto:hello@flashcardsfordevelopers.com">Have a question? Drop us a line.</a>
      </div>

      <div className="my-3 pb-2">
        <h6 className="font-weight-bold text-uppercase">Supplement your learning</h6>
        <p className="text-dark">
          Flashcards are bite-sized concepts you can study anywhere. They are designed so you can
          fit them in anywhere to fill time. You can easily study them at the grocery store, on the
          bus, or in killing time at home. They are designed so you quickly improve your
          understanding of programming concepts.
        </p>
      </div>

      <div className="my-3 pb-2">
        <h6 className="font-weight-bold text-uppercase">Use it or lose it</h6>
        <p className="text-dark">
          Remember your Big-O notation from college? What is an AVL tree? Some things are easy to
          forget when you don't practice them. Flashcards are a great way to discover and close
          those gaps in your knowledge.
        </p>
      </div>

      <div className="my-3 pb-2">
        <h6 className="font-weight-bold text-uppercase">Study Smarter, Not Longer</h6>
        <p className="text-dark">
          Flashcards for Developers uses a straight-forward scheduling system to reduce the amount
          of studying you do over time. This technique, called spaced repetition, can reduce the
          amount of studying you do by half. Using our system, you will learn more with less effort.
        </p>
      </div>

      <div
        className="mb-5 py-5 bg-blueLight"
        style={{
          marginRight: "-40px",
          marginLeft: "-40px",
          paddingRight: "40px",
          paddingLeft: "40px",
          borderRadius: "1px",
        }}
      >
        <div className="mb-3">
          <h6 className="font-weight-bold text-uppercase" style={{ color: "#0a69e8" }}>
            Spaced repetition
          </h6>
          <p className="text-dark">
            Spaced repetition is a learning technique that schedules increasing periods of time
            between each review of some material. This method takes advantage of a psychological
            phenomenon, called the spacing effect. This phenomenon simply states that people learn
            more effectively when studying is spread out over time. The result? Spend less time the
            things you know and more time with the things you don’t.
          </p>
        </div>
        <div className="d-flex align-items-center">
          <img
            className="mx-auto"
            src={require("./graph.png")}
            alt="Graph of forgetting curve"
            style={{ maxWidth: "400px" }}
          />
        </div>
        <p className="text-dark text-center font-italic mt-3" style={{ opacity: 0.8 }}>
          This technique is has been written about in depth by{" "}
          <a className="text-dark text-underline" href="https://sivers.org/srs">
            Derek Sivers
          </a>{" "}
          and{" "}
          <a className="text-dark text-underline" href="http://augmentingcognition.com/ltm.html">
            Michael Nielsen
          </a>
          .
        </p>
      </div>
    </div>
    <div className="py-5 mt-5 text-white" style={{ background: "#0d69e8" }}>
      <div className="container container-narrow">
        <div className="row">
          <div className="col-lg-8 py-3">
            <h6 className="text-uppercase font-weight-medium mb-3">About us</h6>
            <div className="d-flex mb-3">
              <a
                href="https://twitter.com/nikolazaris"
                className="d-flex align-items-center btn text-white py-2 pl-0"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Avatar src={require("./niko.jpg")} alt="Niko's profile" />
                <div className="d-flex flex-column align-items-start ml-2">
                  <div>
                    <span>Niko Lazaris</span>
                  </div>
                  <div>
                    <small style={{ opacity: 0.85 }}>@nikolazaris</small>
                  </div>
                </div>
              </a>
              <a
                href="https://twitter.com/NickySlicksHaha"
                className="d-flex align-items-center btn text-white py-2 pl-0 ml-5"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Avatar src={require("./nick.jpg")} alt="Nick's profile" />
                <div className="d-flex flex-column align-items-start ml-2">
                  <div>
                    <span>Nick Engmann</span>
                  </div>
                  <div>
                    <small style={{ opacity: 0.85 }}>@NickySlicksHaha</small>
                  </div>
                </div>
              </a>
            </div>
            <div
              className="text-white font-weight-light mb-4"
              style={{ opacity: 0.85, maxWidth: "500px" }}
            >
              We are passionate developers and love learning new things together. We want to hear
              from you.{" "}
              <a
                className="text-white text-underline"
                href="mailto:hello@flashcardsfordevelopers.com"
              >
                Drop us a line or just say hi
              </a>{" "}
              👋.
            </div>
          </div>
          <div className="col-lg-4 py-3">
            <h6 className="text-uppercase font-weight-medium mb-3">Stats</h6>
            <div>
              <span className="h2 font-weight-light">
                <strong>2,968</strong> cards studied <br />
                <strong>119,865</strong> times*
              </span>
            </div>
            <div className="mt-3">
              <small>* As of Sept. 2018</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default About;
