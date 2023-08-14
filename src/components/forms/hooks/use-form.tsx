/* eslint-disable */

import React, { FormEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { DevTool } from "@hookform/devtools";

import {
  useForm as useFormReactHookForm,
  FormProvider as FormProviderReactHookForm,
  useFormContext as useFormContextReactHookForm,
  UseFormReset,
  ErrorOption,
  UseFormHandleSubmit,
  UseFormStateProps,
  UseFormReturn,
  UseFormProps,
  FieldValues,
  SubmitErrorHandler,
} from "react-hook-form";
import { CriteriaMode, Mode } from "react-hook-form/dist/types/form";
import { z, ZodTypeAny, ZodSchema, ZodObject } from "zod";

type FormProps = {
  onSubmit?: Function;
};

type TSetErrorFunc = (
  name: string,
  error: ErrorOption,
  options?: { shouldFocus: boolean } | undefined
) => void;

interface HookResponse<T extends FieldValues> extends UseFormReturn<T> {
  submitForm?: UseFormHandleSubmit<T>;
  formErrors: any;
  resetForm: UseFormReturn<T>["reset"];
  // resetForm: UseFormReset<{ [x: string]: {} | undefined }>;
  // setFormValue: (name: string, value: T, config?: Record<string, unknown>) => void;
  setFormValue: UseFormReturn<T>["setValue"];
  getFormValues: UseFormReturn<T>["getValues"];
  validateForm: () => Promise<boolean>;
  // unregister: (name: string) => void;
  // setFocus: (name: string) => void;

  renderForm: (children: any, formProps?: FormProps) => any;
  watchForm: UseFormReturn<T>["watch"];
  setFormError: UseFormReturn<T>["setError"];
}

interface HookParams<T extends FieldValues> extends UseFormProps {
  onSubmit?: (data: T, e?: any) => void;
  onError?: SubmitErrorHandler<T>;
  // onError?: (errors: T, e?: any) => void;
  callingSubmitManually?: boolean;

  defaultValues?: Partial<T>;
  mode?: Mode;
  reValidateMode?: Exclude<Mode, "onTouched" | "all">;
  criteriaMode?: CriteriaMode;
  schema?: ZodTypeAny | any;
}

/**
 * Examples:
 *
 * setFormError("email", "This email is already used")
 * setFormError("password", ["Too short", "Mix different characters"])
 * setFormError("myField", { ...actual RHF error-compliant payload })
 *
 * @param setError
 */
const setFormErrorFactory = (setError: {
  (
    name: string,
    error: ErrorOption,
    options?: { shouldFocus: boolean } | undefined
  ): void;
  (
    name: string,
    error: ErrorOption,
    options?: { shouldFocus: boolean } | undefined
  ): void;
  (arg0: string, arg1: { type: string; message: any }): void;
}) => {
  return (fieldName: string, err: any) => {
    if (typeof err === "string") {
      setError(fieldName, { type: "manual", message: err });
    } else if (Array.isArray(err)) {
      setError(fieldName, { type: "manual", message: err[0] });
    } else {
      setError(fieldName, err);
    }
  };
  // return (fieldName, err) => {
  //   let errorPayload = err;
  //
  //   /*
  //    * Function overloading
  //    */
  //   if (typeof err === "string") {
  //     errorPayload = {
  //       types: {
  //         manual: err,
  //       },
  //     };
  //   }
  //   if (Array.isArray(err)) {
  //     errorPayload = {
  //       types: _.fromPairs(err.map((e, idx) => [`manual${idx}`, e])),
  //     };
  //   }
  //
  //   setError(fieldName, errorPayload);
  // };
};

const defaultFormParams = {
  mode: "onBlur" as Mode,
  reValidateMode: "onBlur" as Exclude<Mode, "onTouched" | "all">,
  criteriaMode: "all" as CriteriaMode,
};

export default function useForm<T extends FieldValues>(
  params: HookParams<T> = {}
): HookResponse<T> {
  const [withDevTool, useDevTool] = React.useState(false);
  const {
    onSubmit,
    onError,
    callingSubmitManually = false,
    schema,
    ...otherParams
  } = params;

  React.useEffect(() => {
    if (process.env.NODE_ENV != "production") {
      useDevTool(true);
    }

    return () => {
      useDevTool(false);
    };
  }, [withDevTool]);

  // @ts-ignore
  const useFormReactHookFormPayload = useFormReactHookForm<T>({
    ...defaultFormParams,
    ...otherParams,
    resolver: schema ? zodResolver(schema) : undefined,
  });

  const {
    handleSubmit,
    reset,
    formState,
    control,
    setValue,
    getValues,
    trigger,
    watch,
    setError,
    unregister,
    setFocus,
  } = useFormReactHookFormPayload;

  const { errors } = formState ?? {};

  const handleSubmitBound = onSubmit
    ? handleSubmit(onSubmit, onError)
    : // Would be undefined traditionally, but let's make this more developer friendly
      () =>
        console.error(
          "You tried calling `submitForm` but forgot to set `onSubmit` callback for it"
        );

  // pair with calling submit manually to prevent default form behaviour
  const _preventSubmit = (e: FormEvent<HTMLFormElement> | undefined) =>
    e?.preventDefault();

  // Magic 🎉
  const renderForm = (children: React.ReactNode, formProps = {}) => (
    <FormProviderReactHookForm {...useFormReactHookFormPayload}>
      {/* we are adding the DevTools by default to every form */}
      {withDevTool && <DevTool control={control} placement="bottom-left" />}

      <form
        onSubmit={
          onSubmit && !callingSubmitManually
            ? handleSubmitBound
            : _preventSubmit
        }
        {...formProps}
      >
        <fieldset disabled={formState.isSubmitting}>{children}</fieldset>
      </form>
    </FormProviderReactHookForm>
  );

  return {
    // @ts-ignore
    submitForm: handleSubmitBound,
    formErrors: errors,
    resetForm: reset,
    setFormValue: setValue,
    getFormValues: getValues,
    validateForm: trigger,
    formState,
    control,
    renderForm,
    watchForm: watch,
    setFormError: setFormErrorFactory(setError as TSetErrorFunc),
    unregister,
    setFocus,
  };
}

export function useFormContext() {
  const {
    handleSubmit,
    formState,
    watch,
    reset,
    getValues,
    setValue,
    trigger,
    setError,
    unregister,
    setFocus,
    clearErrors,
  } = useFormContextReactHookForm() ?? {};

  const { errors } = formState ?? {};

  return {
    errors,
    handleSubmit,
    formState,
    watch,
    reset,
    getValues,
    setValue,
    validateForm: trigger,
    setFormError: setFormErrorFactory(setError),
    // Aliasing
    formErrors: errors,
    resetForm: reset,
    setFormValue: setValue,
    getFormValues: getValues,
    watchForm: watch,
    unregister,
    setFocus,
    clearErrors,
  };
}

export function FormContext(props: { children: any }) {
  const { children } = props;

  const context = useFormContext();

  return children(context);
}

export function FormProvider(props: { [x: string]: any; children: any }) {
  const { children, ...otherProps } = props;

  const useFormReactHookFormPayload = useFormReactHookForm({
    ...defaultFormParams,
    ...otherProps,
  });

  return (
    <FormProviderReactHookForm {...useFormReactHookFormPayload}>
      {children}
    </FormProviderReactHookForm>
  );
}
