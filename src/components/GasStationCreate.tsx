import * as React from 'react';
import { useNavigate } from 'react-router';
import useNotifications from '../hooks/useNotifications/useNotifications';
import {
  createOne as createGasStation,
  validate as validateGasStation,
  type GasStation,
} from '../data/gasstations';
import GasStationForm, {
  type FormFieldValue,
  type GasStationFormState,
} from './GasStationForm';
import PageContainer from './PageContainer';

const INITIAL_FORM_VALUES: Partial<GasStationFormState['values']> = {
  shopName: '',
  telephone: '',
  address: '',
  latitude: undefined,
  longitude: undefined,
  price: undefined,
  productType: 'normal',
  updateDate: '',
};

export default function GasStationCreate() {
  const navigate = useNavigate();

  const notifications = useNotifications();

  const [formState, setFormState] = React.useState<GasStationFormState>(() => ({
    values: INITIAL_FORM_VALUES,
    errors: {},
  }));
  const formValues = formState.values;
  const formErrors = formState.errors;

  const setFormValues = React.useCallback(
    (newFormValues: Partial<GasStationFormState['values']>) => {
      setFormState((previousState) => ({
        ...previousState,
        values: newFormValues,
      }));
    },
    [],
  );

  const setFormErrors = React.useCallback(
    (newFormErrors: Partial<GasStationFormState['errors']>) => {
      setFormState((previousState) => ({
        ...previousState,
        errors: newFormErrors,
      }));
    },
    [],
  );

  const handleFormFieldChange = React.useCallback(
    (name: keyof GasStationFormState['values'], value: FormFieldValue) => {
      const validateField = async (values: Partial<GasStationFormState['values']>) => {
        const { issues } = validateGasStation(values);
        setFormErrors({
          ...formErrors,
          [name]: issues?.find((issue) => issue.path?.[0] === name)?.message,
        });
      };

      const newFormValues = { ...formValues, [name]: value };

      setFormValues(newFormValues);
      validateField(newFormValues);
    },
    [formValues, formErrors, setFormErrors, setFormValues],
  );

  const handleFormReset = React.useCallback(() => {
    setFormValues(INITIAL_FORM_VALUES);
  }, [setFormValues]);

  const handleFormSubmit = React.useCallback(async () => {
    const { issues } = validateGasStation(formValues);
    console.log("issues", issues);
    if (issues && issues.length > 0) {
      setFormErrors(
        Object.fromEntries(issues.map((issue) => [issue.path?.[0], issue.message])),
      );
      return;
    }
    setFormErrors({});

    try {
      await createGasStation(formValues as Omit<GasStation, 'id'>);
      notifications.show('Gas station created successfully.', {
        severity: 'success',
        autoHideDuration: 3000,
      });

      navigate('/gas-stations');
    } catch (createError) {
      notifications.show(
        `Failed to create gas station. Reason: ${(createError as Error).message}`,
        {
          severity: 'error',
          autoHideDuration: 3000,
        },
      );
      throw createError;
    }
  }, [formValues, navigate, notifications, setFormErrors]);

  return (
    <PageContainer
      title="New Gas Station"
      breadcrumbs={[{ title: 'Gas Stations', path: '/gas-stations' }, { title: 'New' }]}
    >
      <GasStationForm
        formState={formState}
        onFieldChange={handleFormFieldChange}
        onSubmit={handleFormSubmit}
        onReset={handleFormReset}
        submitButtonLabel="Create"
      />
    </PageContainer>
  );
}
