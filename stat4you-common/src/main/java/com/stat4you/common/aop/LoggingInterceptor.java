package com.stat4you.common.aop;

import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.stat4you.common.exception.CommonExceptionCodeEnum;

public class LoggingInterceptor {

    private Logger logger = LoggerFactory.getLogger(LoggingInterceptor.class);

    public LoggingInterceptor() {
    }

    public void afterThrowing(Throwable ex) throws Throwable {
        if (ex instanceof ApplicationException) {
            manageApplicationException(ex);
        } else if (ex instanceof Exception) {
            manageException((Exception)ex);
        } else {
            manageOtherThrowable(ex);
        }
    }

    /**
     * Log applicationException
     */
    private void manageApplicationException(Throwable ex) throws Throwable {
        ApplicationException applicationException = (ApplicationException) ex;

        // If exception was already logged, skip the logging
        if (!applicationException.isLogged()) {
            logApplicationException(applicationException, ex);
        }
        // Note: exception will be throwed by advicer
    }

    private void logApplicationException(ApplicationException applicationException, Throwable ex) {
        logger.error("Error: " + applicationException.getErrorCode(), ex);
        applicationException.setLogged(Boolean.TRUE);
    }

    /**
     * Throws only ApplicationException
     */
    private void manageException(Exception ex) throws ApplicationException {
        ApplicationException applicationException = new ApplicationException(CommonExceptionCodeEnum.UNKNOWN.getName(), CommonExceptionCodeEnum.UNKNOWN.getName(), ex);
        logger.error(ex.getMessage(), ex);
        applicationException.setLogged(Boolean.TRUE);
        throw applicationException;
    }

    /**
     * Only log
     */
    private void manageOtherThrowable(Throwable ex) throws Throwable {
        logger.error(ex.getMessage(), ex);
        // Note: exception will be throwed by advicer
    }
}