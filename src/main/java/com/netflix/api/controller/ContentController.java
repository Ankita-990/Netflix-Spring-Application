package com.netflix.api.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.netflix.api.dto.ContentDTO;
import com.netflix.api.service.ContentService;
import com.netflix.api.service.implement.ServiceImplement;

@RestController
@RequestMapping("/api/netflix")
public class ContentController {
	
	private ContentService service;
	
	public ContentController() {
		service = new ServiceImplement();
	}
	
	@PostMapping("/add")
	public ResponseEntity<ContentDTO> addContent(@RequestBody ContentDTO content) {
		ContentDTO newContent = service.addContent(content);
		return new ResponseEntity<ContentDTO>(newContent, HttpStatus.OK);
	}
	
	@GetMapping("/fetch")
	public ResponseEntity<List<ContentDTO>> getContents() {
		List<ContentDTO> content = service.getContents();
		return new ResponseEntity<List<ContentDTO>>(content, HttpStatus.OK);
	}
	
	@GetMapping("/fetchByName/{name}")
	public ResponseEntity<ContentDTO> getContentByName(@PathVariable String name) {
		ContentDTO content = service.getContentByName(name);
		return new ResponseEntity<ContentDTO>(content, HttpStatus.OK);
	}

}
