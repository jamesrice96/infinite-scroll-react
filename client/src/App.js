import React from 'react';
import './css/App.css';

//Components
import Image from './components/Image';

class App extends React.Component {
  constructor(props) {
    super(props);
    //State
    this.state = {
      images: [],
      count: 9,
      start: 1,
      dataLoaded: false,
      imagesLoaded: false
    };
    //Refs
    this.imageGrid = React.createRef();
  }

  async componentDidMount() {
    //Attach scroll event once on mount
    window.addEventListener('scroll', this.handleScroll);
    //Get the first batch of images
    const firstImages = await this.fetchImages();
    // console.log(firstImages);
    this.setState({ images: firstImages, dataLoaded: true });
  }

  async fetchImages() {
    try{
      const resp = await fetch(
        `/api/photos?count=${this.state.count}&start=${this.state.start}`
      );
      const data = await resp.json();
      return data;
    }
    catch(err){
      console.log(err);
    }
  }

  handleScroll = () => {
    const { imagesLoaded } = this.state;
    const windowBottom = window.scrollY + window.innerHeight;
    const gridBottom = this.imageGrid.current.clientHeight;

    if (windowBottom >= gridBottom && imagesLoaded === false) {
      const { count, start } = this.state;
      this.setState({ start: start + count });
      //Load more images once the bottom of the image grid is hit
      this.loadMore();
      //Flag that they've been loaded
      this.setState({ imagesLoaded: true });
    }
  };

  loadMore = async () => {
    //Getting some more images
    const newImages = await this.fetchImages();

    //Concact images into images array the array
    const joinedImages = this.state.images.concat(newImages);

    //Remove duplicate items from array
    const uniqueImages = joinedImages.reduce((acc, image) => {
      //Check if this one is already in the acc
      if (!acc.find(el => el.id === image.id)) {
        return [...acc, image];
      }
      return acc;
    }, []);

    this.setState({
      images: uniqueImages,
      //Reset the images loaded flag
      imagesLoaded: false
    });
  };

  render() {
    const { images, dataLoaded } = this.state;

    if (dataLoaded === true) {
      return (
        <div className="container">
          <h1 className="py-5 text-center">
            Infinite Scroll Unsplash Code Challenge
          </h1>

          <div className="row" ref={this.imageGrid}>
            {images.map(image => (
              <Image key={image.id} image={image} />
            ))}
          </div>
        </div>
      );
    } else {
      return <p>Loading...</p>;
    }
  }
}

export default App;
