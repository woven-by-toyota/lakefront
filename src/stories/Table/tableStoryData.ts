export const CUSTOM_DATA = [{
  title: 'r2204_1_0',
  value: 24,
  percentage: 166.992,
  percentage_change: 6.9579999999,
  total: 0.14371985
},
  { title: 'r2002_1_0', value: 3, percentage: 47.442, percentage_change: 15.814, total: 0.063491 },
  { title: 'r2010_1_0', value: 5, percentage: 25.68, percentage_change: 5.136, total: 0.1947675 },
  { title: 'r2019_1_0', value: 51, percentage: 291.549, percentage_change: 5.7166473529, total: 0.1959277202 },
  { title: 'r2125_1_0', value: 39, percentage: 175.199, percentage_change: 4.4922282052, total: 0.2226686241 },
  { title: 'r2018_1_0', value: 12, percentage: 80.672, percentage_change: 6.7266666, total: 0.148750612 },
  { title: 'r2027_1_0', value: 83, percentage: 275.087, percentage_change: 3.314819277, total: 0.3017716 },
  { title: 'r2016_1_0', value: 27, percentage: 130.419, percentage_change: 4.830333334, total: 0.20705373 },
  { title: 'r2115_1_0', value: 18, percentage: 97.505, percentage_change: 5.7166473529, total: 0.1746059897 },
  { title: 'r1112_1_0', value: 22, percentage: 113.747, percentage_change: 5.7166473529, total: 0.193415712 },
  { title: 'r2110_1_0', value: 80, percentage: 304.77, percentage_change: 3.80969996, total: 0.2625626 }];

export const INITIAL_SORT_BY_DATA = [
  { title: 'car', value: 24, percentage: 166.992, percentage_change: 6.9579999999, total: 0.14371985 },
  { title: 'truck', value: 22, percentage: 304.77, percentage_change: 15.814, total: 0.063491 },
  { title: 'boat', value: 5, percentage: 25.68, percentage_change: 5.136, total: 0.1947675 },
  { title: 'car', value: 51, percentage: 291.549, percentage_change: 5.7166473529, total: 0.1959277202 },
  { title: 'boat', value: 51, percentage: 175.199, percentage_change: 4.4922282052, total: 0.2226686241 },
  { title: 'car', value: 12, percentage: 80.672, percentage_change: 6.7266666, total: 0.148750612 },
  { title: 'truck', value: 83, percentage: 275.087, percentage_change: 3.314819277, total: 0.3017716 },
  { title: 'truck', value: 51, percentage: 130.419, percentage_change: 4.830333334, total: 0.20705373 },
  { title: 'truck', value: 18, percentage: 97.505, percentage_change: 5.7166473529, total: 0.1746059897 },
  { title: 'car', value: 22, percentage: 113.747, percentage_change: 5.7166473529, total: 0.193415712 },
  { title: 'boat', value: 22, percentage: 47.442, percentage_change: 3.80969996, total: 0.2625626 }
];

export const INFINITE_SCROLL_DATA = [
  ...CUSTOM_DATA,
  ...Array.from({ length: 50 }, (_, index) => ({
    title: `r${index + 1}02_1_0`,
    value: Math.floor(Math.random() * 100),
    percentage: parseFloat((Math.random() * 300).toFixed(3)),
    percentage_change: parseFloat((Math.random() * 20).toFixed(6)),
    total: parseFloat((Math.random()).toFixed(8))
  }))
];
