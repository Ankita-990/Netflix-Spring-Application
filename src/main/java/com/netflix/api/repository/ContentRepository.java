package com.netflix.api.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.stereotype.Repository;
import com.netflix.api.entity.Content;

@Repository
public class ContentRepository {
	
	private final List<Content> store;
	private final AtomicInteger id;
	
	public ContentRepository() {
		store = new ArrayList<>();
		id = new AtomicInteger(1);
	}
	
	public Content save(Content content) {
		content.setId(id.getAndIncrement());
		store.add(content);
		return content;
	}
	
	public List<Content> findAll() {
		return List.copyOf(store);
	}
	
	public Optional<Content> findByName(String name) {
		return store.stream()
				.filter(n -> n.getName().toLowerCase().contains((name.toLowerCase())))
				.findAny();
	}
	
	

}
