import { useState } from "react";
import classNames from "classnames";
import type { CSSProperties } from "react";
import homeStyles from "./HomeScreen.module.scss";
import ScreenCard from "./shared/ScreenCard";
import screenStyles from "./shared/ScreenCard.module.scss";
import Button from "./shared/Button";

type HomeScreenProps = {
  badge: string;
  unlockGate?: {
    enabled: boolean;
    code: string;
    codeLength: number;
    tagLabel: string;
    codeInputLabel: string;
    codeInputPlaceholder: string;
    successMessage: string;
  };
  title: string;
  subtitle: string;
  startButtonLabel: string;
  startButtonPulse: boolean;
  onRevealInput?: () => void;
  onStart: () => void;
};

const HomeScreen = ({
  badge,
  unlockGate,
  title,
  subtitle,
  startButtonLabel,
  startButtonPulse,
  onRevealInput,
  onStart,
}: HomeScreenProps) => {
  const [isCodeStep, setIsCodeStep] = useState(false);
  const [isCodeVisible, setIsCodeVisible] = useState(false);
  const [isCodeAccepted, setIsCodeAccepted] = useState(false);
  const [isCodeInvalid, setIsCodeInvalid] = useState(false);
  const [enteredCode, setEnteredCode] = useState("");

  const codeLength = unlockGate?.codeLength ?? 8;

  const handlePrimaryAction = () => {
    if (!unlockGate?.enabled) {
      onStart();
      return;
    }

    if (!isCodeStep) {
      setIsCodeStep(true);
      setIsCodeVisible(false);
      setIsCodeAccepted(false);
      setIsCodeInvalid(false);
      setEnteredCode("");
      onRevealInput?.();
      return;
    }
  };

  const canRevealCode = Boolean(unlockGate?.enabled && isCodeStep);
  const baseTagLabel = unlockGate?.tagLabel ?? badge;
  const revealCode = unlockGate?.code ?? "";
  const tagWidthChars = Math.max(baseTagLabel.length, revealCode.length, 8);
  const tagTextStyle = { "--tag-width": `${tagWidthChars}ch` } as CSSProperties;

  return (
    <ScreenCard className={homeStyles.homeScreen}>
      <button
        className={classNames(screenStyles.badge, homeStyles.codeTag, {
          [homeStyles.codeTagInteractive]: canRevealCode,
        })}
        type="button"
        aria-disabled={!canRevealCode || isCodeVisible}
        onClick={() => {
          if (canRevealCode && !isCodeVisible) {
            setIsCodeVisible(true);
          }
        }}
      >
        <span className={homeStyles.codeTextSlot} style={tagTextStyle}>
          <span
            className={classNames(homeStyles.codeText, {
              [homeStyles.codeTextHidden]: isCodeVisible,
            })}
          >
            {baseTagLabel}
          </span>
          <span
            className={classNames(
              homeStyles.codeText,
              homeStyles.codeTextOverlay,
              { [homeStyles.codeTextShown]: isCodeVisible },
            )}
          >
            {revealCode}
          </span>
        </span>
      </button>

      <h1 className={screenStyles.heading}>{title}</h1>
      <p className={screenStyles.leadText}>{subtitle}</p>

      <div
        className={classNames(homeStyles.actionArea, {
          [homeStyles.actionAreaUnlock]: unlockGate?.enabled,
        })}
      >
        {unlockGate?.enabled && isCodeStep && !isCodeAccepted && (
          <div className={homeStyles.codeGate}>
            <label className={homeStyles.codeLabel} htmlFor="home-secret-code">
              {unlockGate.codeInputLabel}
            </label>

            <input
              id="home-secret-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={codeLength}
              placeholder={unlockGate.codeInputPlaceholder}
              value={enteredCode}
              className={classNames(homeStyles.codeInput, {
                [homeStyles.codeInputInvalid]: isCodeInvalid,
              })}
              onChange={(event) => {
                const digitsOnly = event.target.value
                  .replace(/\D/g, "")
                  .slice(0, codeLength);
                setEnteredCode(digitsOnly);
                setIsCodeInvalid(false);

                if (digitsOnly.length < codeLength) {
                  return;
                }

                if (digitsOnly === unlockGate.code) {
                  setIsCodeAccepted(true);
                  void onStart();
                  return;
                }

                setIsCodeInvalid(false);
                requestAnimationFrame(() => {
                  setIsCodeInvalid(true);
                });
                setTimeout(() => {
                  setIsCodeInvalid(false);
                }, 420);
              }}
            />
          </div>
        )}

        {unlockGate?.enabled && isCodeAccepted && (
          <p className={homeStyles.successText}>{unlockGate.successMessage}</p>
        )}

        {(!unlockGate?.enabled || !isCodeStep) && (
          <Button
            variant="primary"
            pulse={startButtonPulse && !isCodeStep}
            type="button"
            onClick={handlePrimaryAction}
          >
            {startButtonLabel}
          </Button>
        )}
      </div>
    </ScreenCard>
  );
};

export default HomeScreen;
