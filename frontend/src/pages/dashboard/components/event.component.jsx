import { IoLocationSharp, IoCalendarSharp } from "react-icons/io5";

const Event = ({ event }) => {
  return (
    <div className="h-fit w-full rounded-md bg-white p-4 pb-6 md:rounded-lg md:p-6 md:pb-12">
      <div className="space-y-2">
        <div className="grid w-full grid-cols-12 items-center">
          <div className="col-span-8 w-full bg-yellow-50 md:col-span-10">
            <h1 className="text-lg font-bold md:mb-3 md:text-4xl">
              {event.name}
            </h1>
          </div>
          <div className="col-span-4 flex h-full w-full items-center justify-center bg-red-300 md:col-span-2">
            <span>Role</span>
          </div>
        </div>
        <div className="flex w-full items-center justify-start gap-4  md:gap-8">
          <div className="flex items-center justify-center">
            <IoLocationSharp className="mr-1 inline-block text-sm md:text-lg" />
            <span className="text-sm font-semibold md:text-lg">
              {event.location}
            </span>
          </div>
          <div className="flex items-center justify-center">
            <IoCalendarSharp className="mr-1 inline-block text-sm md:text-lg" />
            <span className="text-sm font-semibold md:text-lg">Date</span>
          </div>
        </div>
        <div className="w-full">
          <p className="line-clamp-2 md:text-2xl md:line-clamp-3">
            {event.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Event;
