var wps = (function() {
  console.log("this is happening");
  return {
    getClimateIndicators: function *() {
      this.body = [
        {
          key: "key1",
          value: "value1"
        },
        {
          key: "key2",
          value: "value2"
        },
        {
          key: "key3",
          value: "value3"
        },
      ];
    }
  };
})();
export default wps
