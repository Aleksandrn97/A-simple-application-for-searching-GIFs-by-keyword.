import React from 'react';
import FormControl from './UI/FormControl';
import 'bootstrap/dist/css/bootstrap.css';
import {ErrorModal} from './UI/ErrorModal';

const API_KEY: string = 'DCUuRzYSgOcRfsmON6HB03dX2Rly1BfM'; // API ключ Giphy

interface GiphyImageData {
  images: {
    fixed_height: {
      url: string;
    };
    original: {
      url: string;
    };
  };
  title: string;
  id: string;
}

const GetGiphyImages: React.FC = () => {
  const [tag, setTag] = React.useState<string>('');
  const [imageData, setImageData] = React.useState<GiphyImageData[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isGrouped, setIsGrouped] = React.useState<boolean>(false);
  const [showError, setShowError] = React.useState<boolean>(false);
  const [groupedTags, setGroupedTags] = React.useState<string[]>([]);
  const [showTextError, setShowTextError] = React.useState<string>('');

  const handleLoadImages = async () => {
    const tags = tag.split(',').map((tag) => tag.trim());
    if (tags.length === 0 || tags.some((t) => t === '')) {
      setShowError(true);
      setShowTextError('Поле ввода тегов должно быть заполнено!');
      return;
    }

    setIsLoading(true);
    const imagesPromises = tags.map(async (tag) => {
      try {
        const response = await fetch(
          `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${tag}`
        );
        const data = await response.json();
        return data.data;
      } catch (error) {
        console.error(error);
        return [];
      }
    });
    const imagesData = await Promise.all(imagesPromises);
    const combinedImages = imagesData.reduce((acc, images) => acc.concat(images), []);

    if (combinedImages.length === 0) {
      setShowError(true);
      setShowTextError(`По тегу "${tag}" ничего не найдено :(`);
    }

    setImageData(combinedImages);
    setIsLoading(false);
    setGroupedTags(tags);
  };


  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const pattern = /^[a-zA-Z,]*$/;
    const cleanedValue = inputValue.replace(/[^a-zA-Z,]$/, '');

    if (!pattern.test(inputValue)) {
      e.target.value = cleanedValue;
      setShowError(true);
      setShowTextError('Только латинские буквы и запятая!');
    } else {
      setTag(inputValue);
    }
  };

  const handleClearImages = () => {
    setImageData([]);
    setTag('');
    if (isGrouped) setIsGrouped(!isGrouped);
    if (showError) setShowError(!showError);
  };

  const toggleGroupingButton: () => void = () => setIsGrouped(!isGrouped);
  const handleImageClick = (clickedTag: string) => () => setTag(clickedTag);
  const openAndCloseModalWindow: () => void = () => setShowError(false);

  const groupImages = (images: GiphyImageData[], tags: string[]) => {
    const groupedImages: { [key: string]: GiphyImageData[] } = {};

    images.forEach((image) => {
      const imageTags = image.title.split(' ');
      const commonTags = imageTags.filter((imageTag) => tags.includes(imageTag.toLowerCase()));

      if (commonTags.length > 0) {
        const key = commonTags.join(',');
        if (key in groupedImages) {
          groupedImages[key].push(image);
        } else {
          groupedImages[key] = [image];
        }
      }
    });

    return Object.values(groupedImages);
  };

  return (
    <div className="main-page">
      <div className="btn-panel">
        <FormControl
          inputValue={tag}
          handleInput={handleInput}
          handleLoadImages={handleLoadImages}
          handleClearImages={handleClearImages}
          isLoading={isLoading}
          toggleGroupingButton={toggleGroupingButton}
          isGrouped={isGrouped}
        />
      </div>

      <div className="images-grid-container">
        <ErrorModal
          show={showError}
          onClose={openAndCloseModalWindow}
          textError={showTextError}
        />


        {!isLoading && !isGrouped && imageData && imageData.map((image) => (
          <div key={image.id} className="images-no-group-item">
            <img
              src={image.images.fixed_height.url}
              alt={image.title}
              onClick={handleImageClick(image.title)}
            />
          </div>
        ))}
      </div>

      {
        React.Children.toArray(
          !isLoading && isGrouped && imageData
          && groupedTags.map((tag, index) => (
            <div>
              <div key={index} className="image-group">
                <span>{tag}</span>
                {
                  React.Children.toArray(
                    groupImages(imageData, [tag]).map((group) => (
                      <div>
                        {group.map((image) => (
                          <img
                            key={image.id}
                            src={image.images.fixed_height.url}
                            alt={image.title}
                            onClick={handleImageClick(tag)}
                          />
                        ))}
                      </div>
                    )))}
              </div>
            </div>
          ))
        )
      }
    </div>
  );
};

export default GetGiphyImages;
