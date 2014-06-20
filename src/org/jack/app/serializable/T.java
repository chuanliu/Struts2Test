package org.jack.app.serializable;

import java.io.Serializable;

class T implements Serializable {
	int i = 10;
	int j = 9;
	double d = 2.3;
	transient int k = 15;
}
