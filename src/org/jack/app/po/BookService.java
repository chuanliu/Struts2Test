package org.jack.app.po;

public class BookService {
	public Book[] getBooks(){
		return new Book[]
				{
				new Book("疯狂 java 讲义", "李刚"),
				new Book("轻量级Java EE 企业应用实战", "李刚"),
				new Book("经典Java EE 企业应用实战", "李刚"),
				new Book("疯狂 Ajax 讲义", "李刚")
				
		};
	}

}
