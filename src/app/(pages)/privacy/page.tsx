import type { JSX } from "react";

export default function Page(): JSX.Element {
  return (
    <>
      <main className="prose mx-auto py-10 px-5">
        <h1>Privacy Policy</h1>
        <p>Last Updated: 28/03/2024</p>
        <p>
          Welcome to Skycle.app! Your privacy is of utmost importance to us.
          This Privacy Policy outlines the types of information we access, why
          we access it, and what we do (and don&apos;t do) with that
          information.
        </p>
        <h2>Information We Access</h2>
        <p>
          Skycle.app accesses public data provided by the Bluesky API. This data
          includes:
        </p>
        <ul>
          <li>User avatars</li>
          <li>Public interactions between users on Bluesky</li>
        </ul>
        <p>
          We do not require users to log in or provide any personal information
          to use Skycle.app.
        </p>
        <h2>How We Use The Information</h2>
        <p>
          We use the public data from Bluesky to visually generate circles with
          user avatars based on their interactions. This allows us to provide
          you with a graphical representation of interactions between Bluesky
          users.
        </p>
        <h2>Data Storage and Retention</h2>
        <p>
          Skycle.app does not store any data. We fetch data in real-time from
          the Bluesky API for the sole purpose of creating visual
          representations during your session. Once your session is terminated
          or you close the application, we retain no data from that session.
        </p>
        <h2>Data Security</h2>
        <p>
          While we do not store any data, we ensure that the data we temporarily
          access is handled with the utmost care. Our application is designed to
          work directly with the Bluesky API without intermediary storage
          solutions, minimizing potential security risks.
        </p>
        <h2>Third-Party Access</h2>
        <p>
          We do not provide, sell, or lease any data to third parties.
          Skycle.app operates without third-party ads or trackers, ensuring your
          experience is as private as possible.
        </p>
        <h2>Changes to This Privacy Policy</h2>
        <p>
          We may occasionally update this Privacy Policy to reflect changes in
          our practices or for other operational, legal, or regulatory reasons.
          Any changes will be posted on this page, so we encourage users to
          check back regularly.
        </p>
        <h2>Contact Us</h2>
        <p>
          If you have questions or concerns about this Privacy Policy or our
          practices, please contact us at:{" "}
          <a href="mailto:contact@skycle.app">contact@skycle.app</a>
        </p>
        <h2>Consent</h2>
        <p>
          By using Skycle.app, you consent to our access to the public data as
          described in this Privacy Policy.
        </p>
      </main>
    </>
  );
}
