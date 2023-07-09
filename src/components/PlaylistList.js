//array of random search terms (made them code related)
const searchTerms = [
  "factory%20functions",
  "data%20structures",
  "array%20functions%20javascript",
  "composition%20over%20inheritance",
  "lambda%20functions",
  "streams%20java",
  "higher%20order%functions%javascript",
  "functional%20programming",
  "c++%20lambda%20functions",
  "sorting%20algorithms",
];
//a function to get a random search term
const getSearchTerm = () =>
  searchTerms[Math.floor(Math.random() * (searchTerms.length - 1))];
//variable for your API_KEY
const YOUTUBE_API_KEY = "AIzaSyDR1bcZpiCikYEEAx1T8kw4emKn9GBzl2w";
//url from YouTube docs modified for my random term and API key,
const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${getSearchTerm()}&key=${YOUTUBE_API_KEY}`;
//fetch function following the aforementioned process
fetch(url)
  .then((response) => response.json())
  .then((data) => {
    //console.log(data.items[0].id.videoId);
    //console.log above is to help access proper data in the JSON
    //object
    //set iframe source to proper URL (notice same dynamic strings
    //used above)
    document.querySelector(
      ".iframeClass"
    ).src = `https://www.youtube.com/embed/${data.items[0].id.videoId}`;
  });
