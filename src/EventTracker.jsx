import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";

export default function HorizontalStepperWithError() {
  const [activeStep, setActiveStep] = useState(0);
  const [stepFailed, setStepFailed] = useState([]);
  const [tests, setTests] = useState({});
  const [processFinished, setProcessFinished] = useState(false);
  const countOutboundRequests = (tests) =>
    tests?.filter((test) => test.message_type.includes("[OUTBOUND]")).length;

  const countInboundRequests = (tests) =>
    tests?.filter((test) => test.message_type.includes("[INBOUND]")).length;

  const countFailedOutboundRequests = (tests) =>
    tests?.filter(
      (test) =>
        test.message_type.includes("[OUTBOUND]") && test.status === "FAILED"
    ).length;

  const countFailedInboundRequests = (tests) =>
    tests?.filter(
      (test) =>
        test.message_type.includes("[INBOUND]") && test.status === "FAILED"
    ).length;

  const countSuccessOutboundRequests = (tests) =>
    tests?.filter(
      (test) =>
        test.message_type.includes("[OUTBOUND]") && test.status === "FINISHED"
    ).length;

  const countSuccessInboundRequests = (tests) =>
    tests?.filter(
      (test) =>
        test.message_type.includes("[INBOUND]") && test.status === "FINISHED"
    ).length;

  const steps = [
    `Preparing ${countOutboundRequests(tests?.changes)} Request${
      countOutboundRequests(tests?.changes) > 1 ? "s" : ""
    }`,
    `Executing ${
      countOutboundRequests(tests?.changes) -
      countFailedOutboundRequests(tests?.changes)
    } Change${
      countOutboundRequests(tests?.changes) > 1 ? "s" : ""
    } in RBG Instance`,
    "Executing Changes in LDS",
  ];

  useEffect(() => {
    if (tests?.changes?.length > 0 && !processFinished) {
      let currentFetcherIdx = 0;
      const response =
        currentFetcherIdx > -1 ? tests?.changes[currentFetcherIdx] : undefined;
      const message_id = currentFetcherIdx === -1 ? undefined : 123;

      // ! Step 1 requires a message_id
      const finishStep1 = message_id !== undefined;

      // ! Step 2 requires step1 and at least 1 OUTBOUND event
      const finishStep2 =
        finishStep1 &&
        response !== undefined &&
        countInboundRequests(tests?.changes) > 0 &&
        countOutboundRequests(tests?.changes) ===
          countInboundRequests(tests?.changes);

      // ! Step 3 requires step2 and at least 1 INBOUND event
      const finishStep3 = finishStep2 && tests?.status === "FINISHED";
      setProcessFinished(tests?.status === "FINISHED");

      setActiveStep((oldValue) => {
        let fails = [];

        if (finishStep1 && countFailedOutboundRequests(tests?.changes) > 0) {
          fails.push(1);
        }
        if (
          (tests?.status === "FINISHED" &&
            countFailedOutboundRequests(tests?.changes) > 0 &&
            finishStep2) ||
          (tests?.status === "FINISHED" &&
            countOutboundRequests(tests?.changes) !==
              countInboundRequests(tests?.changes) &&
            countInboundRequests(tests?.changes) > 0)
        ) {
          fails.push(2);
        }
        setStepFailed([...fails]);
        return oldValue < steps.length
          ? finishStep3
            ? 3
            : finishStep2
            ? 2
            : finishStep1
            ? 1
            : oldValue
          : undefined;
      });
      currentFetcherIdx += 1;
    }
    console.log(tests);
  }, [tests]);

  useEffect(() => {
    console.log(activeStep);
  }, [activeStep]);

  const addevent = () => {
    /* setTests({
      status: "PENDING",
      changes: [
        {
          queue_id: 173135,
          message_type: "[OUTBOUND] MAVERICK_UPDATED",
          executions_logs: "[]",
          status: "PENDING",
        },
        {
          queue_id: 173136,
          message_type: "[OUTBOUND] MAVERICK_UPDATED",
          executions_logs: "[]",
          status: "PENDING",
        },
      ],
      execution_data: [],
    });

    if (tests?.changes?.length === 2) {
      setTests({
        status: "PENDING",
        changes: [
          {
            queue_id: 173135,
            message_type: "[OUTBOUND] MAVERICK_UPDATED",
            executions_logs: "[]",
            status: "PENDING",
          },
          {
            queue_id: 173136,
            message_type: "[OUTBOUND] MAVERICK_UPDATED",
            executions_logs: "[]",
            status: "PENDING",
          },
          {
            queue_id: 173141,
            message_type: "[INBOUND] MAVERICK_UPDATED",
            executions_logs: "[]",
            status: "PENDING",
          },
        ],
        execution_data: [
          {
            lot_id: 1935,
            lot_label: "HVF27004",
            evt_name: "VI",
          },
        ],
      });
    }

    if (tests.changes?.length === 3) {
      setTests({
        status: "FINISHED",
        changes: [
          {
            queue_id: 173135,
            message_type: "[OUTBOUND] MAVERICK_UPDATED",
            executions_logs: "[]",
            status: "FAILED",
            error_message:
              'ORA-01756: quoted string not properly terminatedORA-06512: at "LDSI_ADMIN.LDSI_PROCESS_EXECUTOR", line 202\nORA-06512: at "LDS',
          },
          {
            queue_id: 173136,
            message_type: "[OUTBOUND] MAVERICK_UPDATED",
            executions_logs: "[]",
            status: "FINISHED",
          },
          {
            queue_id: 173141,
            message_type: "[INBOUND] MAVERICK_UPDATED",
            executions_logs: "[]",
            status: "FINISHED",
          },
        ],
        execution_data: [
          {
            lot_id: 1935,
            lot_label: "HVF27004",
            evt_name: "VI",
          },
        ],
      });*/
    //////////////////////////////////////////////////////////////////////////////
    /* setTests({
      status: "PENDING",
      changes: [
        {
          queue_id: 173468,
          message_type: "[OUTBOUND] MAVERICK_UPDATED",
          executions_logs: "[]",
          status: "PENDING",
        },
      ],
      execution_data: [],
    });
    if (tests.changes?.length === 1) {
      setTests({
        status: "FINISHED",
        changes: [
          {
            queue_id: 173468,
            message_type: "[OUTBOUND] MAVERICK_UPDATED",
            executions_logs: "[]",
            status: "FAILED",
            error_message:
              'ORA-01756: quoted string not properly terminatedORA-06512: at "LDSI_ADMIN.LDSI_PROCESS_EXECUTOR", line 202\nORA-06512: at "LDS',
          },
        ],
        execution_data: [],
      });*/
    //////////////////////////////////////////////////////////////////////////////
    /*setTests({
      status: "PENDING",
      changes: [
        {
          queue_id: 173468,
          message_type: "[OUTBOUND] MAVERICK_UPDATED",
          executions_logs: "[]",
          status: "PENDING",
        },
      ],
      execution_data: [],
    });

    if (tests.changes?.length === 1) {
      setTests({
        status: "FINISHED",
        changes: [
          {
            queue_id: 173637,
            message_type: "[OUTBOUND] MAVERICK_UPDATED",
            executions_logs: "[]",
            status: "FINISHED",
          },
          {
            queue_id: 173639,
            message_type: "[INBOUND] MAVERICK_UPDATED",
            executions_logs: "[]",
            status: "FINISHED",
          },
        ],
        execution_data: [
          {
            lot_id: 1935,
            lot_label: "HVF27004",
            evt_name: "Other Rejects",
          },
        ],
      });
    }*/
  };

  return (
    <Box sx={{ width: "1160px" }}>
      <button onClick={() => addevent()}>Add</button>
      {console.log(stepFailed)}
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          return (
            <Step
              key={label}
              sx={{
                "& .MuiStepIcon-root": {
                  width: "18px",
                },
              }}
            >
              <StepLabel
                error={stepFailed.includes(index)}
                optional={
                  stepFailed.includes(index) && (
                    <Typography
                      variant="caption"
                      color={
                        countInboundRequests(tests?.changes) !==
                          countOutboundRequests(tests?.changes) &&
                        countInboundRequests(tests?.changes) > 0 &&
                        (tests?.status === "FINISHED" ||
                          tests?.status === "PENDING")
                          ? "#dabb14"
                          : "error"
                      }
                    >
                      Event Failed
                    </Typography>
                  )
                }
                sx={{
                  "& .MuiStepIcon-root.Mui-completed": {
                    color: !stepFailed.includes(index) ? "#4dba3f" : "error",
                  },
                  "& .MuiStepLabel-label.Mui-error": {
                    color: !stepFailed.includes(index)
                      ? "#4dba3f"
                      : countInboundRequests(tests?.changes) !==
                          countOutboundRequests(tests?.changes) &&
                        countInboundRequests(tests?.changes) > 0 &&
                        (tests?.status === "FINISHED" ||
                          tests?.status === "PENDING")
                      ? "#dabb14"
                      : "error",
                  },
                  "& .MuiStepIcon-root.Mui-error": {
                    color: !stepFailed.includes(index)
                      ? "#4dba3f"
                      : countInboundRequests(tests?.changes) !==
                          countOutboundRequests(tests?.changes) &&
                        countInboundRequests(tests?.changes) > 0 &&
                        (tests?.status === "FINISHED" ||
                          tests?.status === "PENDING")
                      ? "#dabb14"
                      : "error",
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}
