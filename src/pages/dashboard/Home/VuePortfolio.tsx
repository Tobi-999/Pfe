import { ArrowLeft, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MotivationalLetter() {
  const navigate = useNavigate();

  return (
    <div className="w-full px-6 py-8 space-y-10"> {/* Full width */}
      {/* Go Back */}
      <button
        onClick={() => navigate(-1)} // Go back to the previous page
        className="flex items-center text-sm text-gray-600 hover:text-gray-800 gap-1"
      >
        <ArrowLeft className="w-4 h-4" /> Go Back
      </button>

      {/* Header */}
      <div className="flex items-center gap-6">
        <img
          src="https://i.pravatar.cc/150?img=56"
          alt="Profile"
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h1 className="text-xl font-bold text-gray-900">Irma Hane</h1>
          <p className="text-gray-500 text-sm">Farouk@gmail.com</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2">
            <span className="text-xl">+</span> View portfolio
          </button>
        </div>
      </div>

      {/* Motivational Letter */}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Motivational letter</h2>
          <p className="text-gray-500 text-sm">Lorem Ipsum</p>
        </div>

        <div className="bg-purple-50 text-purple-800 p-4 rounded-md text-sm">
          Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam suspendisse morbi eleifend
          faucibus eget vestibulum felis. Dictum quis montes, sit sit. Tellus aliquam enim urna,
          etiam. Mauris posuere.
        </div>

        <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
          <h3 className="font-semibold">LoremIpsum</h3>
          <p>
            Dolor enim eu tortor urna sed duis nulla. Aliquam vestibulum, nulla odio nisl vitae. In
            aliquet pellentesque aenean hac vestibulum turpis mi bibendum diam. Tempor integer
            aliquam in vitae malesuada fringilla. Elit nisi in eleifend sed nisi. Pulvinar at orci,
            proin imperdiet commodo consectetur convallis risus.
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>
              Ipsum sit mattis nulla quam nulla. Gravida id gravida ac enim mauris id.Diam elit,
              orci, tincidunt aenean tempus. Quis velit eget ut tortor tellus. Sed vel, congue felis
              elit erat nam nibh orci.
            </li>
            <li>Non pellentesque congue eget consectetur turpis.</li>
            <li>
              Sapien, dictum molestie sem tempor. Diam elit, orci, tincidunt aenean tempus. Quis
              velit eget ut tortor tellus. Sed vel, congue felis elit erat nam nibh orci.
            </li>
          </ul>

          <h3 className="font-semibold">LoremIpsum</h3>
          <p>
            Ipsum sit mattis nulla quam nulla. Gravida id gravida ac enim mauris id. Non
            pellentesque congue eget consectetur turpis. Sapien, dictum molestie sem tempor. Diam
            elit, orci, tincidunt aenean tempus. Quis velit eget ut tortor tellus. Sed vel, congue
            felis elit erat nam nibh orci.
          </p>
          <p>
            Dolor enim eu tortor urna sed duis nulla. Aliquam vestibulum, nulla odio nisl vitae. In
            aliquet pellentesque aenean hac vestibulum turpis mi bibendum diam. Tempor integer
            aliquam in vitae malesuada fringilla.
          </p>
          <p>
            Elit nisi in eleifend sed nisi. Pulvinar at orci, proin imperdiet commodo consectetur
            convallis risus. Sed condimentum enim dignissim adipiscing faucibus consequat, urna.
            Viverra purus et erat auctor aliquam. Risus, volutpat vulputate posuere purus sit congue
            convallis aliquet. Arcu id augue ut feugiat donec porttitor neque. Mauris, neque
            ultricies eu vestibulum, bibendum quam lorem id. Dolor lacus, eget nunc lectus in
            tellus, pharetra, porttitor.
          </p>

          <h3 className="font-semibold">What does success look like?</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque tellus vel pretium
            posuere. Id maecenas a tristique in fusce hendrerit. Amet, mattis in vitae, est urna,
            diam. Ante fringilla nulla at sed tincidunt. Et aliquam neque cras mauris non bibendum.
            Hac ut ridiculus enim urna felis amet. Dolor aliquam diam suspendisse non elit faucibus
            id orci, mi.
          </p>
          <p>
            Pharetra nam gravida commodo accumsan sapien aliquet bibendum purus nunc. Quam cursus at
            eu, aliquam integer. Accumsan, nisi ultricies ut pulvinar fames neque risus. Eu et,
            elementum leo amet bibendum gravida vitae ridiculus.
          </p>
        </div>
      </div>
    </div>
  );
}
