import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent, SelectProps } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';
import dayjs, { Dayjs } from 'dayjs';
import type { GasStation } from '../data/gasstations';

export interface GasStationFormState {
  values: Partial<Omit<GasStation, 'id'>>;
  errors: Partial<Record<keyof GasStationFormState['values'], string>>;
}

export type FormFieldValue = string | string[] | number | boolean | File | null;

export interface GasStationFormProps {
  formState: GasStationFormState;
  onFieldChange: (
    name: keyof GasStationFormState['values'],
    value: FormFieldValue,
  ) => void;
  onSubmit: (formValues: Partial<GasStationFormState['values']>) => Promise<void>;
  onReset?: (formValues: Partial<GasStationFormState['values']>) => void;
  submitButtonLabel: string;
  backButtonPath?: string;
}

export default function GasStationForm(props: GasStationFormProps) {
  const {
    formState,
    onFieldChange,
    onSubmit,
    onReset,
    submitButtonLabel,
    backButtonPath,
  } = props;

  const formValues = formState.values;
  const formErrors = formState.errors;

  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      setIsSubmitting(true);
      try {
        await onSubmit(formValues);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formValues, onSubmit],
  );

  const handleTextFieldChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFieldChange(
        event.target.name as keyof GasStationFormState['values'],
        event.target.value,
      );
    },
    [onFieldChange],
  );

  const handleNumberFieldChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFieldChange(
        event.target.name as keyof GasStationFormState['values'],
        Number(event.target.value),
      );
    },
    [onFieldChange],
  );

  const handleCheckboxFieldChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      onFieldChange(event.target.name as keyof GasStationFormState['values'], checked);
    },
    [onFieldChange],
  );

  const handleDateFieldChange = React.useCallback(
    (fieldName: keyof GasStationFormState['values']) => (value: Dayjs | null) => {
      if (value?.isValid()) {
        onFieldChange(fieldName, value.toISOString() ?? null);
      } else if (formValues[fieldName]) {
        onFieldChange(fieldName, null);
      }
    },
    [formValues, onFieldChange],
  );

  const handleSelectFieldChange = React.useCallback(
    (event: SelectChangeEvent) => {
      onFieldChange(
        event.target.name as keyof GasStationFormState['values'],
        event.target.value,
      );
    },
    [onFieldChange],
  );

  const handleReset = React.useCallback(() => {
    if (onReset) {
      onReset(formValues);
    }
  }, [formValues, onReset]);

  const handleBack = React.useCallback(() => {
    navigate(backButtonPath ?? '/gas-stations');
  }, [navigate, backButtonPath]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      autoComplete="off"
      onReset={handleReset}
      sx={{ width: '100%' }}
    >
      <FormGroup>
        <Grid container spacing={2} sx={{ mb: 2, width: '100%' }}>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.telephone ?? ''}
              onChange={handleTextFieldChange}
              name="telephone"
              label="Telephone"
              error={!!formErrors.telephone}
              helperText={formErrors.telephone ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              type="number"
              value={formValues.price ?? ''}
              onChange={handleNumberFieldChange}
              name="price"
              label="Price"
              error={!!formErrors.price}
              helperText={formErrors.price ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={formValues.updateDate ? dayjs(formValues.updateDate) : null}
                onChange={handleDateFieldChange('updateDate')}
                name="updateDate"
                label="Update date"
                slotProps={{
                  textField: {
                    error: !!formErrors.updateDate,
                    helperText: formErrors.updateDate ?? ' ',
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <FormControl error={!!formErrors.productType} fullWidth>
              <InputLabel id="gas-station-product-type-label">Product Type</InputLabel>
              <Select
                value={formValues.productType ?? ''}
                onChange={handleSelectFieldChange as SelectProps['onChange']}
                labelId="gas-station-product-type-label"
                name="productType"
                label="Product Type"
                defaultValue=""
                fullWidth
              >
                <MenuItem value="Regular">Regular</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Others">Others</MenuItem>
              </Select>
              <FormHelperText>{formErrors.productType ?? ' '}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              type="number"
              value={formValues.latitude ?? ''}
              onChange={handleNumberFieldChange}
              name="latitude"
              label="Latitude"
              error={!!formErrors.latitude}
              helperText={formErrors.latitude ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              type="number"
              value={formValues.longitude ?? ''}
              onChange={handleNumberFieldChange}
              name="longitude"
              label="Longitude"
              error={!!formErrors.longitude}
              helperText={formErrors.longitude ?? ' '}
              fullWidth
            />
          </Grid>
        </Grid>
      </FormGroup>
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >Back</Button>
        <Button
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
        >
          {submitButtonLabel}
        </Button>
      </Stack>
    </Box>
  );
}
