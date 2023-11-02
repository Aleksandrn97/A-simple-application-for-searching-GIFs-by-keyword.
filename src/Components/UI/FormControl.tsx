import React from 'react';

interface FormControlProps {
  inputValue: string;
  handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLoadImages: () => void;
  handleClearImages: () => void;
  isLoading: boolean;
  toggleGroupingButton: () => void;
  isGrouped: boolean;
}

const FormControl: React.FC<FormControlProps> = (props) => {
  const {
    inputValue,
    handleInput,
    handleLoadImages,
    handleClearImages,
    isLoading,
    toggleGroupingButton,
    isGrouped,
  } = props;

  return (
    <div style={{display: "flex", gap: '5px'}}>
      <input
        type="text"
        placeholder="Введите тег..."
        value={inputValue}
        onChange={handleInput}
      />
      <button
        type='button'
        className='btn btn-success btn-sm'
        onClick={handleLoadImages}
        disabled={isLoading}
        style={isLoading ? {color: '#991b1b'} : {color: '#e4e4e7'}}
      >
        {!isLoading ? `Загрузить` : 'Загрузка...'}
      </button>

      <button
        type='button'
        className='btn btn-danger btn-sm'
        onClick={handleClearImages}
      >
        Очистить
      </button>

      <button
        type='button'
        className='btn btn-primary btn-sm'
        onClick={toggleGroupingButton}
        disabled={inputValue === '' || isLoading}
      >
        {!isGrouped ? 'Группировать' : 'Разгруппировать'}
      </button>
    </div>
  );
};

export default FormControl;
