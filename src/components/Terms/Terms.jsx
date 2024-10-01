import React from "react";
import "./Terms.css";

function Terms() {
  return (
    <div>
      <div class="scrollable-container">
        <div class="container">
          <section class="privacy-policy">
            <h3>Privacy Policy</h3>
            <p class="date">Effective Date: 1st October 2024</p>
            <div class="content-section">
              <div class="grid-container">
                <div class="grid-item1">
                  <div class="vertical-line-container">
                    <div class="circle1">1</div>
                    <div class="vertical-dash1"></div>
                  </div>
                </div>
                <div class="grid-item2">
                  <h2>Introduction</h2>
                  <p>
                    Welcome to Wayfinder ("we", "us",
                    "our"). We respect your privacy and are committed to
                    safeguarding your personal information. This Privacy Policy
                    outlines how we handle your data when you use our app. By
                    using Wayfinder, you agree to the terms
                    outlined in this policy.
                  </p>
                </div>
              </div>
            </div>
            <div class="content-section">
              <div class="grid-container">
                <div class="grid-item1">
                  <div class="vertical-line-container">
                    <div class="circle2">2</div>
                    <div class="vertical-dash2"></div>
                  </div>
                </div>
                <div class="grid-item2">
                  <h2>Information We Collect and How We Use It</h2>
                  <div class="box">
                    <object
                      data="locationDataImg.svg"
                      type="image/svg+xml"
                      width="65"
                      height="65"
                    ></object>
                    <h3>Location Data</h3>
                    <p>
                      To provide you with accurate navigation and directions,
                      Wayfinder uses your location data.
                      This is the only type of data collected from you.
                    </p>
                    <object
                      data="DataRetentionImg.svg"
                      type="image/svg+xml"
                      width="65"
                      height="65"
                    >
                      {" "}
                    </object>
                    <h3>Data Retention</h3>
                    <p>
                      We do not store or retain any location data or other
                      personal information from you. Once your navigation
                      session is complete, your location data is not saved or
                      kept by us.
                    </p>
                    <object
                      data="DataUseImg.svg"
                      type="image/svg+xml"
                      width="65"
                      height="65"
                    >
                      {" "}
                    </object>
                    <h3>Data Use</h3>
                    <p>
                      Your location data is used in real-time solely for the
                      purpose of delivering navigation and directions to help
                      you reach your destination. We do not use your location
                      data for any other purposes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="content-section">
              <div class="grid-container">
                <div class="grid-item1">
                  <div class="vertical-line-container">
                    <div class="circle3">3</div>
                    <div class="vertical-dash3"></div>
                  </div>
                </div>
                <div class="grid-item2">
                  <h2>Data Sharing</h2>
                  <object
                    data="DataSharingImg.svg"
                    type="image/svg+xml"
                    width="65"
                    height="65"
                  >
                    {" "}
                  </object>
                  <p>
                    We do not share your location data with any third parties.
                    Your data is used exclusively within the app to provide the
                    services you request.
                  </p>
                </div>
              </div>
            </div>
            <div class="content-section">
              <div class="grid-container">
                <div class="grid-item1">
                  <div class="vertical-line-container">
                    <div class="circle4">4</div>
                    <div class="vertical-dash4"></div>
                  </div>
                </div>
                <div class="grid-item2">
                  {" "}
                  <h2>Data Security</h2>
                  <object
                    data="DataSecurityImg.svg"
                    type="image/svg+xml"
                    width="65"
                    height="65"
                  >
                    {" "}
                  </object>
                  <p>
                    We implement appropriate security measures to protect your
                    data during its use. However, since we do not retain data,
                    there is no data stored that needs long-term security
                    protection.
                  </p>
                </div>
              </div>
            </div>
            <div class="content-section">
              <div class="grid-container">
                <div class="grid-item1">
                  <div class="vertical-line-container">
                    <div class="circle5">5</div>
                    <div class="vertical-dash5"></div>
                  </div>
                </div>
                <div class="grid-item2">
                  <h2>User Choices</h2>
                  <object
                    data="UserChoicesImg.svg"
                    type="image/svg+xml"
                    width="65"
                    height="65"
                  >
                    {" "}
                  </object>
                  <p>
                    You can control your device's location settings at any time.
                    If you choose to disable location services for Mumbai
                    Botanical Garden & Zoo, some features of the app may not be
                    available.
                  </p>
                </div>
              </div>
            </div>
            <div class="content-section">
              <div class="grid-container">
                <div class="grid-item1">
                  <div class="vertical-line-container">
                    <div class="circle6">6</div>
                    <div class="vertical-dash6"></div>
                  </div>
                </div>
                <div class="grid-item2">
                  <h2>Changes to This Policy</h2>
                  <object
                    data="ChangesThisPolicyImg.svg"
                    type="image/svg+xml"
                    width="65"
                    height="65"
                  >
                    {" "}
                  </object>
                  <p>
                    We may update this Privacy Policy occasionally to reflect
                    changes in our practices or for other operational, legal, or
                    regulatory reasons. Any changes will be posted on our app or
                    website. We encourage you to review the policy periodically.
                  </p>
                </div>
              </div>
            </div>
            <div class="content-section">
              <div class="grid-container">
                <div class="grid-item1">
                  <div class="vertical-line-container">
                    <div class="circle7">7</div>
                    <div class="vertical-dash7"></div>
                  </div>
                </div>
                <div class="grid-item2">
                  <h2>Contact Us</h2>
                  <object
                    data="ContactUsImg.svg"
                    type="image/svg+xml"
                    width="65"
                    height="65"
                  >
                    {" "}
                  </object>
                  <p>
                    For any questions or concerns regarding this Privacy Policy
                    or our data practices, please contact us at:
                  </p>
                  <p>
                    <strong>
                      <b>Email : </b> info@hubgisall.com
                    </strong>
                  </p>
                  <br />
                  <p>
                    <strong>
                      <b>Address :</b>702 C, B Square, Andheri – Kurla Rd, J B
                      Nagar, Andheri East, Mumbai, Maharashtra 400 059, India.
                    </strong>
                  </p>{" "}
                  <br />
                  <p>
                    <strong>
                      <b>Phone : </b> +91 22 4605 4952
                    </strong>
                  </p>
                </div>
              </div>
            </div>
            <div class="content-section">
              <div class="grid-container">
                <div class="grid-item1">
                  <div class="vertical-line-container">
                    <div class="circle8">8</div>
                  </div>
                </div>
                <div class="grid-item2">
                  <h2>Consent</h2>
                  <object
                    data="ConsentImg.svg"
                    type="image/svg+xml"
                    width="65"
                    height="65"
                  >
                    {" "}
                  </object>
                  <p>
                    By using Wayfinder, you consent to the
                    use of your location data as described in this Privacy
                    Policy.
                  </p>
                </div>
              </div>
            </div>
          </section>
          <footer>
            <h2 className="text-white">&copy; 2024 Wayfinder | All Rights Reserved</h2>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default Terms;
