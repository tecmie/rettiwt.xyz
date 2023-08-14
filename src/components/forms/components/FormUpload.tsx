/* eslint-disable */
import React, {
  ComponentPropsWithoutRef,
  forwardRef,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Accept, useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";
import {
  Box,
  Flex,
  HStack,
  Icon,
  Image,
  Spinner,
  Text,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { BsTrash } from "react-icons/bs";
import { CgFileDocument } from "react-icons/cg";
import { HiOutlineCloudUpload } from "react-icons/hi";

type Props = {
  name: string;
  label?: string;
  accept?: Accept;
  required?: boolean;
  labelProps?: ComponentPropsWithoutRef<"label">;
};

const FormUpload = forwardRef<HTMLInputElement, Props>(
  ({ name, label, accept, required, labelProps }, ref) => {
    const [isTouched, setTouched] = useState(false);
    const {
      register,
      unregister,
      setValue,
      watch,
      formState: { isSubmitting },
    } = useFormContext();
    const files = watch(name);
    const onDrop = useCallback(
      (droppedFiles: any) => {
        setValue(name, droppedFiles, { shouldValidate: true });
      },
      [setValue, name]
    );
    const { getRootProps, getInputProps } = useDropzone({
      onDrop,
      accept,
    });
    useEffect(() => {
      register(name);
      return () => {
        unregister(name);
      };
    }, [register, unregister, name]);

    const removeHandler = (_id: string) => {
      const newImages = files?.filter(
        (item: { name: string }) => item.name !== _id
      );

      setValue(name, newImages);

      setValue(_id, undefined);
    };

    useEffect(
      () => () => {
        files?.forEach((file: { preview: any }) =>
          URL.revokeObjectURL(file.preview || "")
        );
      },
      [files]
    );

    const thumbs = files?.map(
      (file: { name: string; preview: string | undefined }) => (
        <Box w={"full"} key={file.name} pos="relative">
          {isSubmitting && (
            <Flex
              align="center"
              justify="center"
              pos="absolute"
              inset={0}
              h="full"
              w="full"
            >
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
              />
            </Flex>
          )}
          {file?.preview ? (
            <>
              <Image
                w="full"
                h="auto"
                fit="cover"
                src={file?.preview}
                alt={file?.name}
              />
              <Flex
                align="center"
                justify="center"
                as="button"
                role="button"
                aria-label="remove button"
                pos="absolute"
                right={0}
                top={0}
                zIndex={10}
                w={8}
                h={8}
                rounded="full"
                color="white"
                onClick={() => removeHandler(file.name || "")}
              >
                <Icon as={BsTrash} />
              </Flex>
            </>
          ) : (
            <HStack
              spacing="1rem"
              align="center"
              justify="space-between"
              w="full"
              overflow="hidden"
            >
              <Icon boxSize={6} as={CgFileDocument} />
              <Text fontSize="sm" textAlign="left">
                {file?.name}
              </Text>
            </HStack>
          )}
        </Box>
      )
    );

    return (
      <FormControl
        ref={ref}
        isRequired={required}
        onMouseLeave={() => isTouched}
      >
        <FormLabel fontSize="sm" {...labelProps}>
          {label}
        </FormLabel>
        <HStack spacing="1.5rem">
          <FormLabel
            minW={"full"}
            display="flex"
            w="full"
            alignItems="center"
            justifyContent="space-between"
            borderWidth={1}
            borderStyle="dashed"
            borderColor="grayLight"
            p={5}
            rounded="xl"
            color="grayLight"
            {...getRootProps({
              className: "dropzone",
              onClick: () => setTouched(true),
            })}
          >
            {files?.length >= 1 ? (
              <Box>{thumbs}</Box>
            ) : (
              <Flex align="center" justify="space-between" w="full">
                <input {...getInputProps()} />
                <Text fontSize="sm">Click to upload document</Text>
                <Icon as={HiOutlineCloudUpload} boxSize={5} />
              </Flex>
            )}
          </FormLabel>
          <Box></Box>
        </HStack>
      </FormControl>
    );
  }
);

FormUpload.displayName = "FormUpload";

export default FormUpload;
