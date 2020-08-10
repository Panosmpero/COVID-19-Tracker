import numeral from "numeral";

const formatNumber = (num) => {
  return num ? `+${numeral(num).format("0.0a")}` : "+0";
}

export default formatNumber