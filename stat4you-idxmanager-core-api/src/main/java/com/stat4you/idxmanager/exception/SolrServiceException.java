package com.stat4you.idxmanager.exception;

public class SolrServiceException extends Exception {

	private static final long serialVersionUID = 490006667656376596L;
	private SolrServiceExceptionType reasonType;
	private String messageToUser = null;

	public SolrServiceException(SolrServiceExceptionType reasonType, String messageToUser) {
		super(messageToUser);
		this.messageToUser = messageToUser;
		this.reasonType = reasonType;
	}
	
	/**
	 * El mensaje por defecto es el definido en el tipo de la excepción.
	 * @param reasonType
	 */
	public SolrServiceException(SolrServiceExceptionType reasonType) {
		super(reasonType.name());
		this.messageToUser = reasonType.name();
		this.reasonType = reasonType;
	}
	
	/**
	 * El mensaje por defecto es el definido en el tipo de la excepción.
	 * @param reasonType
	 */
	public SolrServiceException(SolrServiceExceptionType reasonType, Throwable cause) {
	    super(reasonType.name(), cause);
	    this.messageToUser = reasonType.name();
	    this.reasonType = reasonType;
	}

	public String getMessageToUser() {
		return messageToUser;
	}

	public SolrServiceExceptionType getReasonType() {
		return reasonType;
	}

	@Override
	@Deprecated
	public String getMessage() {
		return super.getMessage();
	}
}
