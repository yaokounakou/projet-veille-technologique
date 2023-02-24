import { Link } from "react-router-dom";
import { IoLocationSharp } from "react-icons/io5";

const MyEvent = ({ event }) => {
  return (
    <Link to={`/details/${event.id}`}>
      <div className="min-h-min w-full rounded-md bg-white p-4 pb-6 md:rounded-lg md:p-6 md:pb-12">
        <div className="space-y-2">
          <div className="grid w-full grid-cols-12 items-center">
            <div className="col-span-8 w-full md:col-span-10">
              <h1 className="text-lg font-bold md:mb-3 md:text-4xl">
                {event.name}
              </h1>
            </div>
            <div className="col-span-4 flex h-full w-full items-center justify-center bg-red-300 md:col-span-2">
              <span>{event.role}</span>
            </div>
          </div>
          <div className="flex w-full">
            <div className="flex items-center justify-center">
              <IoLocationSharp className="mr-1 inline-block text-sm md:text-2xl" />
              <p className="text-sm font-semibold md:text-2xl">
                {event.location}
              </p>
            </div>
          </div>
          <div className="w-full">
            <p className="line-clamp-2 md:text-2xl md:line-clamp-3">
              {event.description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MyEvent;
