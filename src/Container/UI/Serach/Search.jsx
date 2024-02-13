import propTypes from "prop-types";

export default function Search({ changeHandler, value }) {
  return (
    <input
      value={value}
      onChange={changeHandler}
      className="mt-3 w-4/5 m-auto p-2 rounded-3xl bg-white outline-none"
      placeholder="search by name"
      type="text"
    />
  );
}

Search.propTypes = {
  changeHandler: propTypes.func,
  value: propTypes.string,
};
