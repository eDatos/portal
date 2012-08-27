package com.stat4you.idxmanager.exception;

public class IdxManagerException extends Exception {

	private static final long serialVersionUID = 1341288309180966773L;
	private IdxManagerExceptionType reasonType;
	private String messageToUser = null;
	
	public IdxManagerException(IdxManagerExceptionType reasonType, String messageToUser) {
		super(messageToUser);
		this.messageToUser = messageToUser;
		this.reasonType = reasonType;
	}
	
	/**
	 * El mensaje por defecto es el definido en el tipo de la excepción.
	 * @param reasonType
	 */
	public IdxManagerException(IdxManagerExceptionType reasonType) {
		this.messageToUser = reasonType.name();
		this.reasonType = reasonType;
	}
	
	public IdxManagerException(IdxManagerExceptionType reasonType, Throwable cause) {
		super(reasonType.name(),cause);
		this.messageToUser = reasonType.name();
		this.reasonType = reasonType;
	}
	
	public IdxManagerException(IdxManagerExceptionType reasonType, String messageToUser, Throwable cause) {
		super(messageToUser,cause);
		this.messageToUser = messageToUser;
		this.reasonType = reasonType;
	}

	public String getMessageToUser() {
		return messageToUser;
	}

	public IdxManagerExceptionType getReasonType() {
		return reasonType;
	}

	@Override
	@Deprecated
	public String getMessage() {
		return super.getMessage();
	}
}
