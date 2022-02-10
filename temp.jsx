<Formik
  initialValues={{
    gender: "",
  }}
  validate={(values) => {}}
  onSubmit={(values, { setSubmitting }) => {
    setTimeout(() => {
      console.log(values);
      alert(JSON.stringify(values, null, 2));
      setSubmitting(false);
    }, 400);
  }}
>
  {({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    /* and other goodies */
  }) => (
    <form
      onSubmit={handleSubmit}
      className="h-[calc(15rem-2.8rem)] flex flex-col justify-between px-[1rem] py-[1rem] font-medium"
    >
      <div className="flex flex-col text-[.9rem]  px-[.5rem]">
        <div className="flex items-center">
          <input
            name="gender"
            className="w-4 h-4 mr-[.3rem] "
            type="radio"
            value="female"
            defaultChecked={user.gender === "male" ? "true" : "false"}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <p>Male</p>
        </div>
        <div className="flex my-[.5rem] items-center">
          <input
            onChange={handleChange}
            onBlur={handleBlur}
            name="gender"
            className="w-4 h-4 mr-[.3rem] "
            type="radio"
            value="female"
            defaultChecked={user.gender === "female" ? "true" : "false"}
          />
          <p>Female</p>
        </div>
        <div className="flex items-center">
          <input
            onChange={handleChange}
            onBlur={handleBlur}
            name="gender"
            className="w-4 h-4 mr-[.3rem] "
            type="radio"
            value="other"
            defaultChecked={user.gender === "other" ? "true" : "false"}
          />
          <p>Prefer Not To Say</p>
        </div>
      </div>
      <button className="w-full bg-[#0095f6] text-[#fff] py-[.5rem]  font-medium rounded-lg">
        Done
      </button>
    </form>
  )}
</Formik>;
