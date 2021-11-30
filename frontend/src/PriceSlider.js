import { useState } from 'react';
import { Slider } from '@material-ui/core';

const minDistance = 1.5;

export default function PriceSlider() {
    const [value, setValue] = useState([10, 20]);

    const valueLabelFormat = (value) => {
        return `$${value}`;
    };

    const handleChange = (event, newValue) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        if (newValue[0] !== value[0]) {
            setValue([Math.min(newValue[0], value[1] - minDistance), value[1]]);
        } else {
            setValue([value[0], Math.max(newValue[1], value[0] + minDistance)]);
        }
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
                width: '100px',
                color: 'success.main',
                '& .MuiSlider-thumb': {
                    borderRadius: '1px',
                },
            }}
        />
    );
}