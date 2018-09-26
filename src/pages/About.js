import React from "react";

const Avatar = ({ src, alt }) => (
  <img
    className="rounded rounded-circle"
    style={{ width: "75px", height: "75px" }}
    src={src}
    alt={alt}
  />
);

const nickImage = "https://pbs.twimg.com/profile_images/981557025782996993/6jfhJE0N_400x400.jpg";
const nikoImage = "https://pbs.twimg.com/profile_images/781131028631085056/XpNjOI5O_400x400.jpg";

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

      <div className="my-5 pb-2">
        <h6 className="font-weight-bold text-uppercase">Supplement your learning</h6>
        <p className="text-dark">
          Flashcards for Developers is built around the idea that memory fades. Flashcards are
          perfect for testing your recall and strengthening the signal in your brain. The flashcards
          helps you practice at the best time so you spend less effort to learn what you want.
        </p>
      </div>

      <div className="my-5 pb-2">
        <h6 className="font-weight-bold text-uppercase">Use it or lose it</h6>
        <p className="text-dark">
          Flashcards for Developers is built around the idea that memory fades. Flashcards are
          perfect for testing your recall and strengthening the signal in your brain. The flashcards
          helps you practice at the best time so you spend less effort to learn what you want.
        </p>
      </div>

      <div
        className="mb-5 py-5"
        style={{
          background: "#e7f2ff",
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
            Flashcards for Developers is built around the idea that memory fades. Flashcards are
            perfect for testing your recall and strengthening the signal in your brain. The
            flashcards helps you practice at the best time so you spend less effort to learn what
            you want.
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
          <a className="text-dark text-underline" href="">
            Derek Sivers
          </a>{" "}
          and{" "}
          <a className="text-dark text-underline" href="">
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
                <Avatar src={nikoImage} alt="Niko's profile" />
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
                <Avatar src={nickImage} alt="Nick's profile" />
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
                <strong>1901</strong> cards studied <br />
                <strong>69,001</strong> times*
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
