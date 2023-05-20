import { Component } from "react";
import "./App.css";
import { Searchbar } from "./components/Searchbar/Searchbar";
import { ImageGallery } from "./components/ImageGallery/ImageGallery";
import { MyModal } from "./components/Modal/Modal";
import Button from "@mui/material/Button";
import { Loader } from "./components/Loader/Loader";

const API_KEY = "35565772-7bd4f47208013e8d69d75afde";
const URL = "https://pixabay.com/api/";
const per_page = 12;

export class App extends Component {
  state = {
    images: [],
    searchedWord: "",
    page: 1,
    totalHits: null,
    clickedImg: "",
    isModalShown: false,
    isLoading: false,
    error: null,
  };

  handleSubmit = (evt) => {
    evt.preventDefault();
    const formatedString = evt.currentTarget.elements.input.value
      .split(" ")
      .join("+");
    this.setState({ searchedWord: formatedString });
  };

  handleClick = () => {
    this.setState((state) => ({ page: state.page + 1 }));
  };

  onShowModal = (clickedImg) => {
    this.setState({ clickedImg: clickedImg, isModalShown: true });
  };

  onCloseModal = () => {
    this.setState({ isModalShown: false });
  };

  fetchImgs = async () => {
    const { searchedWord, page } = this.state;
    return fetch(
      `${URL}?key=${API_KEY}&q=${searchedWord}&image_type=photo&orientation=horizontal&per_page=${per_page}&page=${page}`
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return Promise.reject(new Error("Failed to find any images"));
        }
      })
      .then((images) => {
        if ((images.total = 0)) {
          console.log("Did found anything :(");
        } else {
          const selectedProperties = images.hits.map(
            ({ id, webformatURL, largeImageURL }) => {
              return { id, webformatURL, largeImageURL };
            }
          );

          this.setState((state) => ({
            images: [...state.images, ...selectedProperties],
            isLoading: false,
            totalHits: images.totalHits,
          }));
        }
      })
      .catch((error) => console.log(error));
  };

  async componentDidUpdate(prevProps, prevState) {
    const { searchedWord, page } = this.state;
    if (searchedWord !== prevState.searchedWord) {
      this.setState({
        images: [],
        isLoading: true,
        page: 1,
      });
      this.fetchImgs();
    } else if (page !== prevState.page) {
      this.setState({ isLoading: true });
      this.fetchImgs();
    }
  }
  render() {
    const { images, totalHits, page, isModalShown, clickedImg, isLoading } =
      this.state;
    return (
      <>
        {isModalShown && (
          <MyModal clickedImg={clickedImg} onClose={this.onCloseModal} />
        )}
        <Searchbar onSubmit={this.handleSubmit} />
        <ImageGallery images={images} openImg={this.onShowModal} />
        {isLoading ? (
          <Loader />
        ) : (
          totalHits / per_page > page && (
            <Button variant="outlined" onClick={this.handleClick}>
              Load More
            </Button>
          )
        )}
      </>
    );
  }
}

export default App;
