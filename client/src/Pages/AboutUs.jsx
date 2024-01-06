import React from "react";
import AppLayout from "../Layout/AppLayout";

const AboutUs = () => {
  return (
    <AppLayout>
      <main className="container mx-auto mt-8 p-4 px-32">
        <section className="mb-8">
          <h2 className="text-3xl font-semibold mb-4">About Us</h2>
          <p className="text-gray-700 leading-relaxed">
            Welcome to our food ordering website! We are passionate about
            providing you with delicious and convenient food options. Our team
            is dedicated to ensuring a seamless and enjoyable experience for our
            customers.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-3xl font-semibold mb-4">Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            Our mission is to satisfy your cravings by offering a diverse menu
            of high-quality and tasty food items. We strive to make the ordering
            process simple and the delivery prompt so that you can enjoy your
            meals with ease.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Contact Us</h2>
          <p className="text-gray-700 leading-relaxed">
            If you have any questions or feedback, feel free to reach out to us.
            We value your input and are always looking for ways to improve our
            services.
          </p>
          <p className="mt-2">
            Email:{" "}
            <a href="mailto:info@foodordering.com" className="text-blue-500">
              info@foodordering.com
            </a>
          </p>
        </section>
      </main>
    </AppLayout>
  );
};

export default AboutUs;
