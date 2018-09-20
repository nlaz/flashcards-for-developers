import React from "react";

const Image = ({ src, alt }) => (
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
        <p className="text-dark font-weight-medium">
          Flashcards for Developers is a learning tool for developers. It is a place for those who
          want to learn better, upgrade their expertise, and keep those skills sharp.
        </p>
        <a href="mailto:hello@flashcardsfordevelopers.com">Have a question? Drop us a line.</a>
      </div>

      <div className="my-5" style={{ minHeight: "50vh" }}>
        <h6 className="font-weight-bold text-uppercase">Use it or lose it</h6>
        <p className="text-dark">
          80% of what you hear, read, and write will be forgotten tomorrow. Repetition will help you
          remember things you want to learn. Flashcards for Developers helps you practice at the
          best time so you spend less effort to learn what you want.
        </p>
        <img
          src={require("./graph.png")}
          style={{ maxHeight: "240px", maxWidth: "420px" }}
          alt="Graph of forgetting curve"
        />
      </div>
    </div>
    <div className="py-5 mt-5 text-white" style={{ background: "#0d69e8" }}>
      <div className="container container-narrow my-3">
        <div className="row">
          <div className="col-8">
            <h6 className="text-uppercase font-weight-medium mb-3">About us</h6>
            <div className="d-flex mb-3">
              <a
                href="https://twitter.com/nikolazaris"
                className="d-flex align-items-center btn text-white py-2 pl-0"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Image src={nikoImage} alt="Niko's profile" />
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
                <Image src={nickImage} alt="Nick's profile" />
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
              We met 6+ years ago in school and have built a developer community together. We are
              passionate developers and love learning new things.
            </div>
          </div>
          <div className="col-4">
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
