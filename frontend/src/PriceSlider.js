import { useState } from 'react';
import { Slider } from '@material-ui/core';

const minDistance = 1.5;


export default function PriceSlider({ setSearchState }) {
    const [value, setValue] = useState([0, 15]);


    const valueLabelFormat = (value) => {
        return `$${value}`;
    };
    
    const handleChange = (event, newValue) => {
        if (!Array.isArray(newValue)) {
            return;
        }
        
        const updatedValues = [
            Math.min(newValue[0], value[1] - minDistance), 
            Math.max(newValue[1], value[0] + minDistance)
        ];

        setValue(updatedValues);
        setSearchState({ 'minPrice': updatedValues[0], 'maxPrice': updatedValues[1] });
    };
    
    return (
        <Slider
            getAriaLabel={() => 'Price range slider'}
            value={value}
            min={0}
            max={25}
            step={0.5}
            onChange={handleChange}
            valueLabelFormat={valueLabelFormat}
            getAriaValueText={valueLabelFormat}
            valueLabelDisplay="auto"
            sx={{
                fontSize: '10px'
            }}
        />
    );
}